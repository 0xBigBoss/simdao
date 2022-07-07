<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	// Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
	import { Svrollbar } from 'svrollbar';
	import VirtualList from 'svelte-tiny-virtual-list';
	import { afterUpdate, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import VoterRow from './VoterRow.svelte';
	import type { Choice, Voter } from './gql/snapshot';

	export let hoveringOverBasket: string | null;
	export let lastChoiceName: string | null;
	export let choice: Choice;
	export let onDragEnter: (e: DragEvent) => void;
	export let onDragLeave: (e: DragEvent) => void;
	export let onDrop: (e: DragEvent) => void;
	export let onDragStart: (event: DragEvent, choiceName: string, voterIndex: number) => void;
	export let updateVote: (fromChoiceName: string, toChoiceName: string, voterIndex: number) => void;

	let choiceVoters = choice.voters.sort((a: Voter, b: Voter) => b.influence - a.influence);
	let choiceVotersCount = writable(choiceVoters.length);

	let wrapper: Element;
	let viewport: Element | null;
	let contents: Element | null;

	onMount(() => {
		viewport = wrapper.querySelector('.virtual-list-wrapper');
		contents = wrapper.querySelector('.virtual-list-inner');
	});

	afterUpdate(() => {
		choiceVotersCount.set(choiceVoters.length);
		choiceVoters = choice.voters.sort((a: Voter, b: Voter) => b.influence - a.influence);
	});
</script>

<div bind:this={wrapper} class="relative wrapper border-2 border-base-content  rounded-lg ">
	<div
		class="viewport relative h-56 no-scrollbar overflow-x-hidden overflow-y-scroll w-full	"
		bind:this={viewport}
		class:hover:border-primary={hoveringOverBasket === choice.name}
		on:dragenter={onDragEnter}
		on:dragleave={onDragLeave}
		on:drop={onDrop}
		ondragover="return false"
	>
		<Svrollbar {viewport} {contents} alwaysVisible />

		<VirtualList
			height={220}
			itemSize={56}
			itemCount={$choiceVotersCount}
			width={'100%'}
			overscanCount={0}
			getKey={(index) => choiceVoters[index]?.address}
		>
			<div
				slot="item"
				class="voter group inline-flex px-4 py-4 items-center gap-4 bg-base-300 rounded-lg p-2 hover:border-accent border-2 border-collapse border-transparent"
				draggable={true}
				on:dragstart={(event) =>
					onDragStart(event, choice.name, choiceVoters.indexOf(choiceVoters[choiceIndex]))}
				on:dblclick={() => {
					if (lastChoiceName) {
						updateVote(
							choice.name,
							lastChoiceName,
							choiceVoters.indexOf(choiceVoters[choiceIndex])
						);
					}
				}}
				let:index={choiceIndex}
				let:style
				{style}
			>
				{#if choiceVoters[choiceIndex]}
					<VoterRow voter={choiceVoters[choiceIndex]} />
				{/if}
			</div>
		</VirtualList>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		--svrollbar-track-width: 0.33rem;
		--svrollbar-track-background: linear-gradient(45deg, hsl(var(--p)), hsl(var(--s)));
		--svrollbar-thumb-width: 0.33rem;
		--svrollbar-thumb-radius: 0;
		--svrollbar-thumb-background: hsl(var(--bc));
	}

	:global(.v-scrollbar) {
		@apply z-10;
	}

	:global(.virtual-list-wrapper) {
		/* hide scrollbar */
		-ms-overflow-style: none !important;
		scrollbar-width: none !important;
	}

	:global(.virtual-list-wrapper::-webkit-scrollbar) {
		/* hide scrollbar */
		display: none !important;
	}

	:global(.virtual-list-inner) {
		overflow-x: hidden;
	}

	.voter {
		@apply cursor-pointer;
	}

	.wrapper :global(svg) {
		@apply inline-block;
	}
</style>
