"""Build frozen, self-contained website exports. Run after pnpm install --frozen-lockfile."""
from pathlib import Path
import io
import json
import re
import shutil
import subprocess
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
HANDOFF = ROOT / 'handoff'
REFS = {
    'current': '01401dbc9b01ba8b803f0f8a0f83264a49736fea',
    'previous': '9e534197e26c595286d56d94b4ab967c423dd86e',
}

def run(*args, cwd=ROOT):
    subprocess.run(args, cwd=cwd, check=True)

for version, ref in REFS.items():
    work = ROOT / '.handoff-build' / version
    shutil.rmtree(work, ignore_errors=True)
    work.mkdir(parents=True)
    archive = subprocess.check_output(['git', 'archive', ref], cwd=ROOT)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        tar.extractall(work, filter='data')
    (work / 'node_modules').symlink_to(ROOT / 'node_modules', target_is_directory=True)
    for filename in ['package.json', 'vite.config.js', 'svelte.config.js', 'src/app.css']:
        shutil.copy2(ROOT / filename, work / filename)
    config = work / 'svelte.config.js'
    config.write_text(config.read_text().replace('@sveltejs/adapter-vercel', '@sveltejs/adapter-static'))
    (work / 'src/routes/+layout.js').write_text('export const prerender = true;\nexport const trailingSlash = "always";\n')
    for route in ['api', '[slug]', 'sitemap.xml']:
        shutil.rmtree(work / 'src/routes/(app)' / route, ignore_errors=True)
    shutil.copy2(HANDOFF / 'snapshots' / f'{version}.json', work / 'src/lib/handoff-data.json')
    (work / 'src/routes/(app)/+layout.server.js').write_text(
        "import data from '$lib/handoff-data.json';\nexport function load() { return data; }\n")
    # A local photograph replaces the live map embed; the existing directions link remains.
    page = work / 'src/routes/(app)/+page.svelte'
    page.write_text(re.sub(r'<Map\s[\s\S]*?/>',
        '<img src="/images/office.jpg" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />',
        page.read_text()))
    layout = work / 'src/routes/(app)/+layout.svelte'
    layout.write_text(layout.read_text().replace('{$page.url.origin}', '{meta.companyWebsite}'))
    # The UI library normally calls external placeholder-image services. Export local fallbacks.
    vite = work / 'vite.config.js'
    plugin = r'''{
      name: 'standalone-images', enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('.svelte')) return;
        return code
          .replace(/https:\/\/(?:picsum\.photos|i\.pravatar\.cc|images\.unsplash\.com)[^'"`\s]*/g, '/assets/image-placeholder.svg')
          .replace(/https:\/\/tympanus\.net[^'"`\s]*mask-image\.png/g, '/masks/rounded.svg')
          .replace(/https:\/\/tympanus\.net[^'"`\s]*field\.jpg/g, '/images/office.jpg')
          .replaceAll('https://oneezy.com/logo.svg', '/logo.svg');
      }
    },'''
    vite.write_text(vite.read_text().replace('plugins: [', 'plugins: [\n' + plugin))
    static = work / 'static'
    (static / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.advancedfamilydental.care/</loc></url></urlset>')
    (static / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: https://www.advancedfamilydental.care/sitemap.xml\n')
    # Never ship unrelated historical personal images or developer documentation.
    shutil.rmtree(static / 'images/old', ignore_errors=True)
    (static / 'assets').mkdir(exist_ok=True)
    data = (HANDOFF / 'snapshots' / f'{version}.json').read_text()
    for asset in (HANDOFF / 'assets').iterdir():
        if '/assets/' + asset.name in data:
            shutil.copy2(asset, static / 'assets' / asset.name)
    (static / 'assets/image-placeholder.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">'
        '<rect width="160" height="160" fill="#e5e7eb"/><circle cx="80" cy="58" r="28" fill="#9ca3af"/>'
        '<path d="M24 160v-18a56 56 0 0 1 112 0v18" fill="#9ca3af"/></svg>')
    run('pnpm', 'exec', 'vite', 'build', cwd=work)
    output = work / 'build'
    # Keep only static files actually referenced by the generated website, plus manifest assets.
    texts = '\n'.join(p.read_text(errors='replace') for p in output.rglob('*')
                      if p.is_file() and p.suffix in ['.html', '.js', '.css', '.json', '.xml', '.webmanifest'])
    for asset in static.rglob('*'):
        if not asset.is_file():
            continue
        relative = asset.relative_to(static).as_posix()
        if relative not in texts and not relative.startswith('manifest/') and relative not in ['robots.txt', 'sitemap.xml']:
            (output / relative).unlink(missing_ok=True)
    for folder in sorted(output.rglob('*'), reverse=True):
        if folder.is_dir() and not any(folder.iterdir()):
            folder.rmdir()
    # No build tools, server runtime, keys, or source data required on the receiving host.
    destination = HANDOFF / 'sites' / version
    shutil.rmtree(destination, ignore_errors=True)
    shutil.copytree(output, destination)
    packages = HANDOFF / 'packages'
    packages.mkdir(exist_ok=True)
    with zipfile.ZipFile(packages / f'advanced-family-dental-{version}.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(destination.rglob('*')):
            if p.is_file():
                info = zipfile.ZipInfo(p.relative_to(destination).as_posix(), (2026, 11, 3, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                z.writestr(info, p.read_bytes())
    print(f'Packaged {version}', flush=True)
