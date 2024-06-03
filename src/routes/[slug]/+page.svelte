<script>
	import { Section, Container, Content, Title, Divider } from '@oneezy/ui'

	let { data } = $props()
</script>

<Section id={data.page.slug} class="bg-white" state="normal">
	<Title class="bg-blue-300" title={data.page.title} tagline={data.page.tagline} />
	<Divider color="text-white bg-blue-300" position="top" shape="waves" invert={false} />
	<Container class="p-8">
		<Content>{@html data.page.content}</Content>
	</Container>
</Section>
