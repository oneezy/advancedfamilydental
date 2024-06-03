<script>
	import { Section, Container, Content, Title } from '@oneezy/ui'

	let { data } = $props()
</script>

<Section id="error" class="bg-white " state="normal">
	<Container>
		<Title title="Whoops!" />
		<Content>This page doesn't exist. Go back <a href="/">Home</a>!</Content>
	</Container>
</Section>
