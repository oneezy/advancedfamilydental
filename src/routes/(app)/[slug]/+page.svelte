<script>
	import {Section, Container, Content, Title, Divider} from '@oneezy/ui';

	let {data, page} = $props();

	let shape = 'waves';
	let height = '120px';
	let width = '150%';
</script>

<Section id={data.page.slug} class="bg-blue-300">
	<Title title={data.page.title} tagline={data.page.tagline} />
	<Divider fill="fill-white" {shape} {height} {width} />
</Section>

<Section id={data.page.slug}>
	<Content>{@html data.page.content}</Content>
</Section>
