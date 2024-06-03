<script>
	import '../app.css';
	import {
		Template,
		Header,
		Logo,
		Nav,
		Button,
		Footer,
		Copyright,
		Divider,
		ThemeDark,
		ThemeColor
	} from '@oneezy/ui';
	let { children } = $props();

	import IconFB from '~icons/ic/baseline-facebook';
	import IconGoogle from '~icons/bi/google'
</script>

<Template >
	{#snippet header()}
<!-- 	
		<Header class="h-0" containerClass="preset-glass">
			{#snippet left()}<Logo src="/images/logo.svg" />{/snippet}
			{#snippet center()}<Nav />{/snippet}
			{#snippet right()}<ThemeDark />{/snippet}
		</Header> -->
	{/snippet}

	{#snippet main()}
		{@render children()}
	{/snippet}

	{#snippet footer()}
<!-- 	
		<Divider width="200%" fill="primary" /> -->
		<Footer class="p-4 bg-white">
			{#snippet left()}{/snippet}
			{#snippet center()}
			<section class="flex flex-col mb-10">
				<div class="flex items-center justify-center gap-2">
					<Button href="https://www.facebook.com/ronaldcitranoDDS" target="_blank" ghost icon class="text-4xl"><IconFB /></Button>
					<Button href="https://maps.app.goo.gl/g3gU6jSmCNhe84xo9" target="_blank" ghost icon class="text-3xl"><IconGoogle /></Button>
				</div>
				<Copyright>Advanced Family Dental Care. All Rights Reserved.</Copyright>
			</section>
			{/snippet}
			{#snippet right()}{/snippet}
		</Footer>
	{/snippet}
</Template>
