"""Check the actual ZIP payloads, including assets, module imports and version boundaries."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import re
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
HANDOFF = ROOT / 'handoff'
reports = {}

for version in ['current', 'previous']:
    package = HANDOFF / 'packages' / f'advanced-family-dental-{version}.zip'
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        with zipfile.ZipFile(package) as archive:
            assert archive.testzip() is None, 'ZIP CRC failure'
            assert 'index.html' in archive.namelist(), 'index.html must be at ZIP root'
            assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in archive.namelist())
            archive.extractall(root)
        errors, external_assets, anchors, identifiers, navigations = [], [], [], [], []
        checked = set()

        def asset(url, parent=root):
            if not url or url.startswith(('data:', '#')):
                return
            parsed = urlsplit(url)
            if parsed.scheme or parsed.netloc:
                external_assets.append(url)
                return
            path = unquote(parsed.path)
            target = root / path.lstrip('/') if path.startswith('/') else parent / path
            checked.add(str(target.relative_to(root)))
            if not target.is_file():
                errors.append(f'Missing asset: {url}')

        class Page(HTMLParser):
            def handle_starttag(self, tag, attributes):
                attrs = dict(attributes)
                if attrs.get('id'):
                    identifiers.append(attrs['id'])
                if tag in ['img', 'script', 'source', 'iframe']:
                    asset(attrs.get('src'))
                if tag == 'link' and attrs.get('rel') != 'canonical':
                    asset(attrs.get('href'))
                if tag == 'a':
                    href = attrs.get('href', '')
                    if href.startswith(('#', '/#')):
                        anchors.append(href.split('#')[-1])
                    elif href:
                        navigations.append(href)
                for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)', attrs.get('style', '')):
                    asset(url)

        html = (root / 'index.html').read_text()
        Page().feed(html)
        for css in root.rglob('*.css'):
            for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css.read_text()):
                asset(url, css.parent)
        for script in root.rglob('*.js'):
            for url in re.findall(r'[\'\"]((?:\.\.?/)[^\'\"]+\.js)[\'\"]', script.read_text()):
                asset(url, script.parent)
        manifest = json.loads((root / 'manifest/site.webmanifest').read_text())
        for icon in manifest['icons']:
            asset(icon['src'])
        for path in root.rglob('*.svg'):
            for url in re.findall(r'(?:xlink:)?href=[\'\"]([^\'\"]+)', path.read_text()):
                asset(url, path.parent)
        assert not external_assets, f'{version}: external assets: {external_assets}'
        assert not errors, f'{version}: {errors}'
        assert set(anchors) <= set(identifiers), f'{version}: broken anchors {set(anchors)-set(identifiers)}'
        assert {'home', 'about', 'services', 'testimonials', 'contact', 'faq'} <= set(identifiers)
        assert 'https://app.dentalhq.com/accounts/signup/my-dentist/9628' in navigations
        booking = any('schedule.jarvisanalytics.com' in url for url in navigations)
        assert booking == (version == 'current'), 'Booking update must only exist in current version'
        texts = '\n'.join(p.read_text(errors='replace') for p in root.rglob('*')
                          if p.is_file() and p.suffix in ['.html', '.js', '.css', '.json', '.svg', '.xml'])
        for forbidden in ['opensheet.', 'lh3.googleusercontent.com', 'drive.google.com', '/api/photos/',
                          'picsum.photos', 'i.pravatar.cc', 'images.unsplash.com', 'https://oneezy.com/logo.svg',
                          'maps.google.com/maps', 'sveltekit-prerender']:
            assert forbidden not in texts, f'{version}: remaining runtime dependency {forbidden}'
        snapshot = json.loads((HANDOFF / 'snapshots' / f'{version}.json').read_text())
        for group in ['teamData', 'aboutData', 'reviewData']:
            for row in snapshot[group]:
                if row.get('src'):
                    asset(row['src'])
                label = row.get('name', row.get('title', ''))
                assert label.replace('&', '&amp;') in html, f'Missing content: {label}'
        assert not errors, errors
        other = 'previous' if version == 'current' else 'current'
        other_snapshot = json.loads((HANDOFF / 'snapshots' / f'{other}.json').read_text())
        own_images = {row['src'] for row in snapshot['teamData']}
        other_images = {row['src'] for row in other_snapshot['teamData']}
        assert not own_images.intersection(other_images), 'Versions must retain their respective team photos'
        for image in other_images:
            assert not (root / image.lstrip('/')).exists(), 'Wrong version photo in ZIP'
        assert (root / 'sitemap.xml').is_file()
        assert (root / 'robots.txt').is_file()
        assert not any(p.name in ['.env', 'package.json', 'pnpm-lock.yaml'] for p in root.rglob('*'))
        reports[version] = {
            'zip_bytes': package.stat().st_size,
            'sha256': hashlib.sha256(package.read_bytes()).hexdigest(),
            'files': sum(p.is_file() for p in root.rglob('*')),
            'local_asset_and_module_references_checked': len(checked),
            'external_rendering_assets': external_assets,
            'team_members': len(snapshot['teamData']),
            'services': len(snapshot['servicesData']),
            'reviews': len(snapshot['reviewData']),
            'membership_link_preserved': True,
            'online_booking': booking,
            'external_navigation_links': sorted(set(navigations)),
            'result': 'passed',
        }

(HANDOFF / 'verification.json').write_text(json.dumps(reports, indent=2) + '\n')
print(json.dumps(reports, indent=2))
