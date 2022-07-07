<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	// Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
	import { flip } from 'svelte/animate';
	import VoteChoice from '$lib/VoteChoice.svelte';
	import { getStores, navigating, page, session, updated } from '$app/stores';
	import type { Proposal, Vote, Voter } from '$lib/gql/snapshot';
	import { simulate } from '$lib/simulate';
	import { onMount } from 'svelte';
	import type { Dictionary } from 'lodash';

	let loading: Promise<{
		proposals: {
			[k: string]: Proposal;
		};
		voterVotes: Dictionary<
			{
				proposalId: string;
				id: string;
				voter: string;
				created: number;
				choice: string;
			}[]
		>;
		voters: Voter[];
	}>;
	let proposals: Record<string, Proposal>;
	let voterVotes: Record<string, Vote[]>;
	let voters: Voter[];

	let lastChoiceName = '';
	let totalInfluence = 0;
	let choices: Choice[] = [];

	let hoveringOverBasket: string | null = null;

	function dragStart(event: DragEvent, choiceName: string, voterIndex: number) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the basket from which it is leaving.
		const data = { choiceName, itemIndex: voterIndex };
		event.dataTransfer!.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: DragEvent, choiceName: string) {
		event.preventDefault();
		const json = event!.dataTransfer!.getData('text/plain');
		const data = JSON.parse(json);
		updateVote(data.choiceName, choiceName, data.itemIndex);
	}

	function updateVote(fromChoiceName: string, toChoiceName: string, voterIndex: number) {
		// Remove the item from one basket.
		// Splice returns an array of the deleted elements, just one in this case.
		const newChoice = choices.find((v) => v.name === toChoiceName)!;
		const oldChoice = choices.find((v) => v.name === fromChoiceName)!;
		const [item] = oldChoice!.voters.splice(voterIndex, 1);

		// Add the item to the drop target basket.
		newChoice!.voters.push(item);
		choices = choices;

		lastChoiceName = toChoiceName;
		hoveringOverBasket = null;
	}

	onMount(async () => {
		loading = simulate($page.params.spaceId);
		({ proposals, voterVotes, voters } = await loading);
		totalInfluence = voters.reduce((acc, voter) => acc + voter.influence, 0);
		choices = [
			{
				name: 'Undecided',
				voters: voters
			},
			{
				name: 'Yays',
				voters: []
			},
			{
				name: 'Nays',
				voters: []
			}
		];
	});
</script>

<svelte:head>
	<title>DAOsim | Simulate Proposal {$page.params.spaceId}</title>
	<meta name="description" content="A DAO proposal simulator app" />
</svelte:head>

<section class="max-w-4xl w-full m-auto">
	<div class="card py-10">
		<h1 class="text-4xl font-bold">Simulating Proposal: {$page.params.spaceId}</h1>

		<p>Drag addresses to yes or no to begin simulating.</p>
	</div>

	{#await loading}
		<svg
			class="animate-spin mx-auto h-56 w-56 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{:then}
		<div class="py-5">
			<div class="stats stats-vertical lg:stats-horizontal bg-base-300 shadow w-full">
				{#each choices.filter((v) => v.name === 'Yays') as choice, choiceIndex (choice)}
					<div class="stat">
						<div class="stat-title text-2xl">{choice.name}</div>
						<div class="stat-value text-6xl">
							<span class="countdown font-mono text-6xl">
								<span
									style="--value:{Math.min(
										99,
										(choice.voters.reduce((i, { influence }) => i + influence, 0) /
											totalInfluence) *
											100
									).toFixed(0)};"
								/> %
							</span>
						</div>
						<div class="stat-desc text-2xl"><b class="text-primary">Influence</b></div>
					</div>
				{/each}
				{#each choices.filter((v) => v.name === 'Nays') as choice, choiceIndex (choice)}
					<div class="stat">
						<div class="stat-title text-2xl">{choice.name}</div>
						<div class="stat-value text-6xl">
							<span class="countdown font-mono text-6xl">
								<span
									style="--value:{Math.min(
										99,
										(choice.voters.reduce((i, { influence }) => i + influence, 0) /
											totalInfluence) *
											100
									).toFixed(0)};"
								/> %
							</span>
						</div>
						<div class="stat-desc text-2xl"><b class="text-primary">Influence</b></div>
					</div>{/each}
				{#each choices.filter((v) => v.name === 'Undecided') as choice, choiceIndex (choice)}
					<div class="stat">
						<div class="stat-title text-2xl">{choice.name}</div>
						<div class="stat-value text-6xl">
							<span class="countdown font-mono text-6xl">
								<span
									style="--value:{Math.min(
										99,
										(choice.voters.reduce((i, { influence }) => i + influence, 0) /
											totalInfluence) *
											100
									).toFixed(0)};"
								/> %
							</span>
						</div>
						<div class="stat-desc text-2xl"><b class="text-primary">Influence</b></div>
					</div>
				{/each}
			</div>
		</div>

		<div class="py-5">
			{#each choices.filter((v) => v.name === 'Undecided') as choice, choiceIndex (choice)}
				<div class="w-full vote-choice-grid" animate:flip>
					<h3 class="text-xl pb-4">
						<div class="badge">{choice.voters.length}</div>
						<b>{choice.name}</b>
					</h3>
					{#if lastChoiceName}
						<small>PROTIP: Double-click to add to <b>{lastChoiceName}</b></small>
					{/if}
					<VoteChoice
						{choice}
						{hoveringOverBasket}
						{lastChoiceName}
						onDragEnter={() => (hoveringOverBasket = choice.name)}
						onDragLeave={() => (hoveringOverBasket = null)}
						onDrop={(event) => drop(event, choice.name)}
						onDragStart={dragStart}
						{updateVote}
					/>
				</div>
			{/each}
		</div>

		<div class="py-5">
			<div class="flex w-full">
				{#each choices.filter((v) => v.name === 'Yays') as choice, choiceIndex (choice)}
					<div class="vote-choice-col grid flex-grow w-1/2" animate:flip>
						<div>
							<h3 class="w-full text-center text-xl pb-4">
								<div class="badge">{choice.voters.length}</div>
								<b>{choice.name}</b>
							</h3>
						</div>
						<VoteChoice
							{choice}
							{hoveringOverBasket}
							{lastChoiceName}
							onDragEnter={() => (hoveringOverBasket = choice.name)}
							onDragLeave={() => (hoveringOverBasket = null)}
							onDrop={(event) => drop(event, choice.name)}
							onDragStart={dragStart}
							{updateVote}
						/>
					</div>
				{/each}

				<div class="divider divider-horizontal w-10">VS</div>

				{#each choices.filter((v) => v.name === 'Nays') as choice, choiceIndex (choice)}
					<div class="vote-choice-col grid flex-grow w-1/2" animate:flip>
						<div>
							<h3 class="w-full text-center text-xl pb-4">
								<div class="badge">{choice.voters.length}</div>
								<b>{choice.name}</b>
							</h3>
						</div>
						<VoteChoice
							{choice}
							{hoveringOverBasket}
							{lastChoiceName}
							onDragEnter={() => (hoveringOverBasket = choice.name)}
							onDragLeave={() => (hoveringOverBasket = null)}
							onDrop={(event) => drop(event, choice.name)}
							onDragStart={dragStart}
							{updateVote}
						/>
					</div>
				{/each}
			</div>
		</div>
	{:catch e}
		<div class="py-5">
			<div class="text-center">
				<h1 class="text-4xl">Error</h1>
				<p class="text-2xl">{e.message}</p>
			</div>
		</div>
	{/await}
</section>

<style lang="postcss">
	ul {
		@apply flex border-2 p-2;
	}

	:global(li) {
		@apply cursor-pointer;
	}

	.vote-choice-grid :global(ul) {
		@apply grid grid-cols-2 md:grid-cols-3;
	}

	.vote-choice-col :global(ul) {
		@apply flex-col;
	}

	.vote-choice-col :global(li) {
		@apply w-full flex;
	}

	.vote-choice-col :global(.viewport) {
		@apply min-h-16 max-h-96;
	}
</style>
