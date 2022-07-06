<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	// Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
	import { flip } from 'svelte/animate';
	import { Svrollbar } from 'svrollbar';
	import jazzicon from '@metamask/jazzicon';
	import { browser } from '$app/env';
	import ExternalLinkIcon from 'heroicons/solid/external-link.svg?component';

	let viewport: Element;
	let contents: Element;
	export let hoveringOverBasket: string | null;
	export let lastChoiceName: string | null;
	export let choice: Choice;
	export let onDragEnter: (e: DragEvent) => void;
	export let onDragLeave: (e: DragEvent) => void;
	export let onDrop: (e: DragEvent) => void;
	export let onDragStart: (event: DragEvent, choiceName: string, voterIndex: number) => void;
	export let updateVote: (fromChoiceName: string, toChoiceName: string, voterIndex: number) => void;
	export let extraCssClassNames: string = '';

	const getAvatar = (address: string) => {
		if (browser) {
			return jazzicon(100, parseInt(address.slice(2, 10), 16)).innerHTML;
		} else null;
	};
</script>

<div class="relative wrapper border-2 border-base-content  rounded-lg px-2">
	<div
		class="viewport relative h-56 no-scrollbar overflow-x-hidden overflow-y-scroll"
		bind:this={viewport}
		class:hover:border-primary={hoveringOverBasket === choice.name}
		on:dragenter={onDragEnter}
		on:dragleave={onDragLeave}
		on:drop={onDrop}
		ondragover="return false"
	>
		<ul
			bind:this={contents}
			class="flex gap-2 gap-y-4 py-2 relative max-w-full {extraCssClassNames}"
		>
			{#each choice.voters.sort((a, b) => b.influence - a.influence) as voter, itemIndex (voter)}
				<li
					class="group inline-flex px-4 py-4 items-center gap-4 bg-base-300 rounded-lg p-2 hover:border-accent border-2 border-collapse border-transparent"
					animate:flip
					draggable={true}
					on:dragstart={(event) => onDragStart(event, choice.name, itemIndex)}
					on:dblclick={() => lastChoiceName && updateVote(choice.name, lastChoiceName, itemIndex)}
				>
					<div class="avatar">
						<div class="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
							{#if voter.avatar}
								<img src={voter.avatar} alt={voter.name} />
							{:else}
								{@html getAvatar(voter.address)}
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
				</li>
			{:else}
				<li class="block mr-2">
					<br />
				</li>
			{/each}
		</ul>
	</div>
	<Svrollbar {viewport} {contents} alwaysVisible />
</div>

<style lang="postcss">
	.wrapper {
		--svrollbar-track-width: 0.33rem;
		--svrollbar-track-background: linear-gradient(45deg, hsl(var(--p)), hsl(var(--s)));
		--svrollbar-thumb-width: 0.33rem;
		--svrollbar-thumb-radius: 0;
		--svrollbar-thumb-background: hsl(var(--bc));
	}

	li {
		@apply cursor-pointer;
	}

	.wrapper :global(svg) {
		@apply inline-block;
	}
</style>
