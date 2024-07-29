<script>
	import {
		Hero,
		Page,
		Section,
		Container,
		Content,
		Card,
		Map,
		Image,
		Mask,
		Accordion,
		AccordionItem,
		Link,
		Button,
		Review,
		Stat,
		Slider,
		Title,
		Team
	} from '@oneezy/ui';
	import { formatPhoneNumber } from '@oneezy/ui/utils/utils.js';

	let {
		data,
		metaData,
		pageData,
		quicklinksData,
		teamData,
		aboutData,
		servicesData,
		reviewData,
		faqData,
		children,
		...props
	} = $props();

	let classes = 'card grid items-center justify-start flex-1';

	let dividerFill = 'fill-neutral-50-800';
	let dividerWidth = '150%';
	let dividerHeight = 'calc(14vw + 1px)';

	// Extract the "Home" page data and the rest of the pages
	let meta = data.metaData[0];
	let homePage = data.pageData.find((page) => page.pageSlug === 'home');
	let otherPages = data.pageData.filter((page) => page.pageSlug !== 'home');

	import PhoneIcon from '~icons/solar/phone-bold';
	import MapIcon from '~icons/solar/map-point-bold';
	import StarIcon from '~icons/material-symbols/kid-star';
	import ReviewIcon from '~icons/material-symbols/android-messages';
	import DoctorIcon from '~icons/fa6-solid/user-doctor';
	import OfficeIcon from '~icons/ph/building-office-fill';
	import SmileIcon from '~icons/streamline/chat-bubble-oval-smiley-2-solid';
	import EmailIcon from '~icons/ic/round-mail';

	let classIcons = 'text-secondary text-6xl p-2';
</script>

{#snippet toothIcon(classes)}
	<svg
		class={classIcons}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		width="1.2em"
		height="1.2em"
		viewBox="0 0 32 32"
	>
		<path
			fill="currentColor"
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M23.37 23.68c.27-1.71.33-3.4.32-5.13-.02-1.05-.32-3.34-.32-3.34s3.01-4.14 1.93-7.72c0 0-.57-3.19-4.73-2.22a59.75 59.75 0 0 0-5.37 1.97c-1.77.52-2.2-.15-2.2-.15-.76-.99 1.95-.6 1.95-.6-1.87-1.94-5.02-1.43-5.02-1.43-4.45.8-3.06 7.38-.89 10.17a25.87 25.87 0 0 0-.31 4.69c.02 1.31.13 2.62.43 3.9l.06.27c.2.9.61 2.82 1.42 2.9.75.08 1.09-1.61 1.2-2.22l.02-.07a26.42 26.42 0 0 1 1.51-5.14c.42-1 1.18-2.8 2.48-2.8 3.04 0 4.91 8.6 4.91 8.6l.07.3c.15.7.38 1.75 1.17 1.17.34-.25.6-.6.78-.97a7.6 7.6 0 0 0 .59-2.18ZM20.62 6.95s2.92 2.88.45 6.8c0 0 5.84-4.63-.45-6.8Z"
		/>
	</svg>
{/snippet}

<!-- Home -->
{#if homePage}
	<Hero
		class="min-h-[90vh] lg:min-h-[80svh]"
		logo
		effect={true}
		logoSrc={meta.brandLogo}
		logoSmall={meta.brandLogoSmall}
		logoLarge={meta.brandLogoLarge}
		id={homePage.pageSlug}
		title={homePage.pageTitle}
		tagline={homePage.pageTagline}
		company={meta.companyName}
		button1="Schedule Appointment"
		button1Link="tel:{meta.companyPhone}"
		button2="Get Directions"
		button2Link="#contact"
		src="/images/office.jpg"
		heroGradient="white, transparent, transparent, transparent, #75C8C5"
		divider
		{dividerFill}
		{dividerWidth}
		{dividerHeight}
	/>
{/if}

<!-- Quick Links -->
<Section
	class="relative z-10 grid grid-cols-1 place-items-center items-center justify-center gap-10 p-4 sm:grid-cols-2 lg:-mt-52 lg:mb-20 xl:flex xl:flex-row "
>
	{#each data.quicklinksData as quicklinks}
		<Card
			class="w-full xl:max-w-[320px]"
			title={quicklinks.title}
			description={quicklinks.description}
			href={quicklinks.href}
		>
			{#if quicklinks.icon === 'doctor'}
				<DoctorIcon class={classIcons} />
			{:else if quicklinks.icon === 'office'}
				<OfficeIcon class={classIcons} />
			{:else if quicklinks.icon === 'services'}
				{@render toothIcon(' size-14')}
			{:else if quicklinks.icon === 'appointment'}
				<SmileIcon class={classIcons} />
			{/if}
		</Card>
	{/each}
</Section>

<!-- Pages -->
{#each otherPages as page}
	<Page
		class="min-h-[80vh] overflow-hidden {page.pageSlug === 'contact' ? '' : ''} {page.pageSlug === 'services'
			? 'bg-neutral-200-700'
			: ''}"
		classContainer={page.pageSlug === 'contact' ? '' : ''}
		id={page.pageSlug}
		title={page.pageTitle}
		tagline={page.pageTagline}
		titleOutside={page.pageSlug === 'contact' ? true : false}
		dividerTop={page.pageSlug === 'contact' || 'services' ? true : false}
		dividerStuck={page.pageSlug === 'contact' ? true : false}
		dividerBottom
		{dividerWidth}
		{dividerHeight}
		{dividerFill}
	>
		{#if page.pageSlug === 'about'}
			<!-- Team -->
			<!-- 			 
			{#each data.teamData as team}
				<img src={team.drive} alt={team.name} />
			{/each} -->
			<Slider arrows autoplay duration="3000" class="gap-10">
				{#each data.teamData as team}
					<Team
						id={team.id}
						name={team.name}
						position={team.position}
						image={team.src}
						class="md:min-w-1/4 relative flex w-full shrink-0 snap-center snap-normal items-center justify-center gap-4 overflow-hidden md:w-1/4"
					/>
				{/each}
			</Slider>

			<!-- About -->
			{#each data.aboutData as about}
				<div class="flex flex-col flex-col-reverse items-center md:flex-row md:gap-10 md:even:flex-row-reverse">
					<Content text>
						<h2>{about.title}</h2>
						<p>{about.description}</p>
					</Content>
					<Content class={classes}>
						<Mask
							ratio="2/1"
							mask="/masks/rounded.svg"
							src={about.src}
							alt={about.title}
							class="size-96 rounded-lg shadow-lg"
						/>
					</Content>
				</div>
			{/each}
		{/if}

		<!-- Services -->
		{#if page.pageSlug === 'services'}
			<div class="grid auto-rows-fr grid-cols-1 gap-10 p-4 pb-20 md:grid-cols-3">
				{#each data.servicesData as service}
					<Card title={service.title} description={service.description} classCard="bg-neutral-50-950 pointer-events-none" />
				{/each}
			</div>
		{/if}

		<!-- Contact -->
		{#if page.pageSlug === 'contact'}
			<div class="flex h-[80vh] flex-col gap-4 ">
				<Button href="tel:{meta.companyPhone}" class="relative z-100 text-left text-base lg:text-xl" glass>
					<PhoneIcon class="text-accent text-xl lg:text-3xl" />{formatPhoneNumber(meta.companyPhone)}
				</Button>
				<Button
					href="mailto:{meta.companyEmails[0].email}"
					class="relative z-100 text-left text-base lg:text-xl"
					glass
				>
					<EmailIcon class="text-accent text-xl lg:text-3xl" />{meta.companyEmails[0].email}
				</Button>
				<Button
					href="https://maps.app.goo.gl/qKAxhCoYnzYBpVqv9"
					class="relative z-100 text-left text-base lg:text-xl"
					glass
				>
					<MapIcon class="text-accent text-xl lg:text-3xl" />{meta.companyAddress}
				</Button>
			</div>
			<Map address={meta.companyAddress} zoom={14} class="absolute inset-0 -z-10 scale-[2]" />
		{/if}

		<!-- Testimonials -->
		{#if page.pageSlug === 'testimonials'}
			<div class="mb-20 flex gap-20">
				<Stat title="Rating" value="4.8">
					<StarIcon class="text-accent" />
				</Stat>
				<Stat title="Reviews" value="38">
					<ReviewIcon class="text-accent" />
				</Stat>
			</div>
			<div class="columns-1 gap-4 lg:columns-2 xl:columns-3">
				<Review reviews={data.reviewData} class="mx-2 my-8 break-inside-avoid pointer-events-none" />
			</div>
			<Button
				class="my-20"
				href="https://search.google.com/local/writereview?placeid=ChIJx-FnYE_LPoYRubNNIk7tdn0"
				neutral
				xl>Write us a review?</Button
			>
		{/if}

		<!-- FAQ -->
		{#if page.pageSlug === 'faq'}
			<Accordion>
				{#each data.faqData as faq, index}
					<AccordionItem id={'accordion-item-' + index}>
						{#snippet control()}{faq.question}{/snippet}
						{#snippet panel()}{faq.answer}{/snippet}
					</AccordionItem>
				{/each}
			</Accordion>
		{/if}
	</Page>
{/each}

<!-- CTA -->
<Container class="">
	<Title>Ready for an appointment?</Title>
	<div class="flex flex-col justify-center gap-4 lg:flex-row">
		<Button class="w-full max-w-full flex-1" href="tel:{meta.companyPhone}" xl neutral
			><PhoneIcon class="text-4xl" />Call {formatPhoneNumber(meta.companyPhone)}</Button
		>
		<Button class="w-full max-w-full flex-1" href="https://maps.app.goo.gl/qKAxhCoYnzYBpVqv9" neutral outline xl
			><MapIcon class="text-4xl" />Get Directions</Button
		>
	</div>
</Container>
