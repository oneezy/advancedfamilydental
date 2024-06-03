<script>
	import { Section, Container, Content, Image, Effect, Divider, Title, Button, Logo } from '@oneezy/ui';
  import IconPhome from '~icons/material-symbols/call-sharp';
  import IconMap from '~icons/material-symbols/map-sharp';

  let { data } = $props();
  
	let images = [
		'/images/photo-1.jpg',
    '/images/photo-2.jpg',
    '/images/photo-3.jpg',
    '/images/photo-4.jpg',
    '/images/photo-5.jpg',
    '/images/photo-6.jpg',
    '/images/photo-7.jpg',
    '/images/photo-8.jpeg',
    '/images/photo-9.jpg',
    '/images/photo-10.jpg',
	];
</script>

<!-- children
:::::::::::::::::::::::::::::::: -->
<Section
	class="relative grid grid-rows-[1fr_auto] items-end overflow-hidden min-h-[80dvh]"
>
<!-- <Image bg cover src="https://www.ronaldcitranodds.com/custom/images/banner-1.jpg"> -->
	<Image bg cover slideshow src="{images}">
		<Effect
			gradient="var(--color-primary), transparent, transparent, var(--color-secondary)"
			linear="170deg"
			repeat
		/>
	</Image>

	<div class="flex flex-col items-center justify-center">
    <img class="max-w-xl" src="/logo-stacked.svg" alt="Advanced Family Dental Care" />

		<Title
			title="Advanced Family Dental Care"
			tagline="Our business is smiles."
			class="sr-only text-center text-white text-4xl"
		/>

		<div class="flex flex-col md:flex-row gap-4">
			<Button class="min-w-[340px]" href="tel:+14097684095" lg neutral target="_blank"><IconPhome class="mr-2 text-4xl" />Schedule Appointment</Button>
			<Button class="min-w-[340px]" href="https://maps.app.goo.gl/g3gU6jSmCNhe84xo9" lg glass><IconMap class="mr-2 text-4xl" />Get Directions</Button>
		</div>
	</div>

	<Divider height="240px" fill="fill-white" width="150%" flip={true} />
</Section>


<!-- 
{#each data.pageData as { slug, title, tagline, content }}
  <Section id={slug} class="" state="normal">
    <Divider position="top" shape="arrow" invert={true} />

    <Container>
      <Title {title} {tagline} />
      <Content>{@html content}</Content>
    </Container>

    <Divider position="bottom" shape="arrow" invert={false} />
  </Section>
{/each} -->