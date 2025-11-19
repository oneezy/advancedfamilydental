<script>
	import {
		Section,
		Container,
		Image,
		Effect,
		Title,
		Button,
		Divider,
		Logo,
	} from "@oneezy/ui";

	let {
		logo = true,
		logoEffect = true,
		logoSrc = "https://oneezy.com/logo.svg",
		logoSmall = "https://oneezy.com/logo.svg",
		logoLarge = "https://oneezy.com/logo.svg",
		title = "Title",
		tagline = "Your awesome tagline goes here",
		company = "Company Name",
		button1 = "Button 1",
		button1Link = "#",
		button2 = "Button 2",
		button2Link = "#",
		src = "https://picsum.photos/1920/1080",
		divider = true,
		dividerFill = "fill-neutral-50-800",
		dividerWidth = "150%",
		dividerHeight = "240px",
		dividerStuck = false,
		heroGradient = "white, transparent, transparent, transparent, var(--color-secondary-500)",
		children,
		...props
	} = $props();
</script>

{#snippet IconMap(size)}
	<svg
		class="flex items-center justify-center"
		xmlns="http://www.w3.org/2000/svg"
		width={size ? size : 32}
		height={size ? size : 32}
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M12 2c-4.418 0-8 4.003-8 8.5c0 4.462 2.553 9.312 6.537 11.174a3.45 3.45 0 0 0 2.926 0C17.447 19.812 20 14.962 20 10.5C20 6.003 16.418 2 12 2m0 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}

{#snippet IconPhone(size)}
	<svg
		class="flex items-center justify-center"
		xmlns="http://www.w3.org/2000/svg"
		width={size ? size : 32}
		height={size ? size : 32}
		viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="m16.556 12.906l-.455.453s-1.083 1.076-4.038-1.862s-1.872-4.014-1.872-4.014l.286-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.09 1.587.808 5 4.812 8.982c4.247 4.222 8.232 4.39 9.861 4.238c.516-.048.964-.31 1.325-.67l1.42-1.412c.96-.953.69-2.588-.538-3.255l-1.91-1.039c-.806-.437-1.787-.309-2.417.317"
		/></svg
	>
{/snippet}

{#snippet IconMember(size)}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="flex items-center justify-center"
		width={size ? size : 32}
		height={size ? size : 32}
		viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"
		/></svg
	>
{/snippet}
<!-- children
:::::::::::::::::::::::::::::::: -->
<Section
	{...props}
	class="relative grid grid-rows-[1fr_auto] overflow-hidden {props.class}"
>
	<Image bg cover {src}>
		<Effect gradient={heroGradient} linear="180deg" />
	</Image>

	<Container class="flex flex-col items-center justify-center gap-20 pt-20">
		<Title title={company} class="sr-only text-center text-white" />
		{#if logo}
			<Logo effect={logoEffect} class="flex w-full lg:hidden" src={logoSmall} />
			<Logo effect={logoEffect} class="hidden w-full lg:flex" src={logoLarge} />
			<!-- <Title {tagline} class="text-center text-white" /> -->
		{:else}
			<Title {title} {tagline} class="text-center text-white" />
		{/if}

		<div class="flex flex-col justify-center gap-4 lg:flex-row">
			<Button class="w-full flex-1 lg:min-w-96" href={button1Link} xl secondary>
				{@render IconMember(42)}
				{button1}
			</Button>
			<Button class="w-full flex-1 lg:min-w-96" href={button2Link} neutral xl>
				{@render IconMap(42)}
				{button2}
			</Button>
		</div>
	</Container>

	{#if divider}
		<Divider
			class="mb-[-1px]"
			fill={dividerFill}
			width={dividerWidth}
			height={dividerHeight}
			flip={true}
		/>
	{/if}
</Section>
