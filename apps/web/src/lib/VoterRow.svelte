<script lang="ts">
	import { onMount } from 'svelte';

	import type { Voter } from './gql/snapshot';
	import jazzicon from '@metamask/jazzicon';
	import ExternalLinkIcon from 'heroicons/solid/external-link.svg';

	export let voter: Voter;

	let avatar = voter.avatar;
	let avatar_default: string | null = null;

	onMount(() => {
		if (!avatar) {
			avatar_default = jazzicon(100, parseInt(voter.address.slice(2, 10), 16)).innerHTML;
		}
	});
</script>

<div class="avatar">
	<div class="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
		{#if voter.avatar}
			<img src={voter.avatar} alt={voter.name} />
		{:else}
			{@html avatar_default}
		{/if}
	</div>
</div>
<div class="group-hover:text-white w-3/4 text-ellipsis overflow-hidden ">
	{voter.name}
	<a
		href={`https://snapshot.org/#/profile/${voter.address}`}
		target="_blank"
		title={`${voter.name} Snapshot.org profile`}
		><ExternalLinkIcon width={'1rem'} height={'1rem'} /></a
	>
</div>
<div class="text-accent font-semibold flex justify-between gap-2 bg-inherit">
	<div class="tooltip" data-tip="Voting power">
		{voter.power}
	</div>
	<div class="tooltip tooltip-primary " data-tip="Influence over propsal">
		<span class="text-primary">
			{voter.influence}
		</span>
	</div>
</div>
