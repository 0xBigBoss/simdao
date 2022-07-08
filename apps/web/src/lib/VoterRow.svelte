<script lang="ts">
	import { onMount } from 'svelte';

	import type { Voter } from './gql/snapshot';
	import ExternalLinkIcon from 'heroicons/solid/external-link.svg';

	export let voter: Voter;

	let avatar = voter.avatar;
	let formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 0,
		compactDisplay: 'short',
		notation: 'compact'
	});
</script>

<div class="avatar">
	<div class="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
		<img src={`https://cdn.stamp.fyi/avatar/eth:${voter.address}?s=138`} alt={voter.name} />
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
		{formatter.format(voter.power)}
	</div>
	<div class="tooltip tooltip-primary " data-tip="Influence over propsal">
		<span class="text-primary">
			{formatter.format(voter.influence)}
		</span>
	</div>
</div>
