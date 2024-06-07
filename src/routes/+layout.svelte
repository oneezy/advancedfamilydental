<script>
	import {
		Template,
		Divider,
		Header,
		Logo,
		Nav,
		ThemeDark,
		Footer,
		Copyright
	} from '@oneezy/ui';

	import '../app.css';
	let { children, ...props } = $props();
</script>

<Template>
	{#snippet header()}
		<Header>
			{#snippet left()}<Logo />{/snippet}
			{#snippet center()}<Nav />{/snippet}
			{#snippet right()}<ThemeDark />{/snippet}
		</Header>
	{/snippet}

	{#snippet main()}
		{@render children()}
	{/snippet}

	{#snippet footer()}
		<Divider width="150%" fill="fill-primary" />
		<Footer class="bg-primary text-primary-50-50 p-4">
			{#snippet left()}<Logo />{/snippet}
			{#snippet center()}Social{/snippet}
			{#snippet right()}<Copyright>Oneezy</Copyright>{/snippet}
		</Footer>
	{/snippet}
</Template>
