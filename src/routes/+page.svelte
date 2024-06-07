<script>
	import {
		Hero,
		Section,
		Container,
		Content,
		Divider,
		Card,
		Map,
		Title,
		Accordion,
		AccordionItem
	} from '@oneezy/ui';
	let { children, ...props } = $props();

	let classes = 'card grid items-center justify-start flex-1';
	let width = '150%';
	let height = '240px';
</script>

<Hero id="hero" />

<Section
	class="my-20 grid grid-cols-2 items-center justify-center gap-4 p-4 md:flex md:flex-row md:gap-10 "
>
	<Card total="4" />
</Section>

<Container id="team" class="grid items-center justify-center gap-20">
	<Title>Our Team</Title>
	<div
		class="flex flex-col flex-col-reverse md:flex-row md:gap-10 md:even:flex-row-reverse"
	>
		<Content text class={classes} />
		<Content img class={classes} />
	</div>
	<div
		class="flex flex-col flex-col-reverse md:flex-row md:gap-10 md:even:flex-row-reverse"
	>
		<Content text class={classes} />
		<Content img class={classes} />
	</div>
	<div
		class="flex flex-col flex-col-reverse md:flex-row md:gap-10 md:even:flex-row-reverse"
	>
		<Content text class={classes} />
		<Content img class={classes} />
	</div>
</Container>

<Divider id="services" {width} {height}>
	<Title>Our Services</Title>
	<Container>
		<div
			class="grid grid-cols-1 place-items-center items-center justify-center gap-10 p-4 pb-20 md:grid-cols-3"
		>
			<Card total="9" />
		</div>
	</Container>
</Divider>

<Section>
	<Title>Testimonials</Title>
	<div
		class="my-20 grid grid-cols-2 items-center justify-center gap-4 p-4 md:flex md:flex-row md:gap-10"
	>
		<!-- <Card total="3" /> -->
	</div>
</Section>

<Section
	class="relative min-h-[80vh]"
	fill="fill-neutral-50-800 bg-neutral-50-800"
>
	<Divider
		fill="fill-neutral-50-800"
		flip
		invert
		reverse
		height="240px"
		width="150%"
		top
	/>
	<Title>Contact Us</Title>
	<Map
		address="5385 Laurel, Beaumont, TX, 77707"
		zoom={12}
		class="absolute inset-0 -z-10"
	/>
	<Divider
		class="z-20"
		flip
		fill="fill-neutral-50-800"
		height="240px"
		width="150%"
		bottom
	/>
</Section>

<Section>
	<Title>FAQ</Title>

	<Container>
		<Accordion>
			<AccordionItem id="1">
				{#snippet control()}Question{/snippet}
				{#snippet panel()}{lorem}{/snippet}
			</AccordionItem>
			<hr class="hr" />
			<AccordionItem id="2">
				{#snippet control()}Accordion 2{/snippet}
				{#snippet panel()}{lorem}{/snippet}
			</AccordionItem>
			<hr class="hr" />
			<AccordionItem id="3">
				{#snippet control()}Accordion 3 (disabled){/snippet}
				{#snippet panel()}{lorem}{/snippet}
			</AccordionItem>
			<hr class="hr" />
			<AccordionItem id="4">
				{#snippet control()}Accordion 4{/snippet}
				{#snippet panel()}{lorem}{/snippet}
			</AccordionItem>
		</Accordion>
	</Container>
</Section>
