<script context="module" lang="ts">
	export const prerender = true;

	import '$lib/mock';
</script>

<script lang="ts">
	import { getStores, navigating, page, session, updated } from '$app/stores';

	// Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
	import { flip } from 'svelte/animate';

	let votes = [
		{
			name: 'Undecided',
			items: ['GrapeFruit', 'Orange', 'Pineapple', 'Banana', 'Apple']
		},
		{
			name: 'Yays',
			items: []
		},
		{
			name: 'Nays',
			items: []
		}
	];

	let hoveringOverBasket: string | null = null;

	function dragStart(event: DragEvent, choiceName: string, itemIndex: number) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the basket from which it is leaving.
		const data = { choiceName, itemIndex };
		event.dataTransfer!.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: DragEvent, choiceName: string) {
		event.preventDefault();
		const json = event!.dataTransfer!.getData('text/plain');
		const data = JSON.parse(json);

		// Remove the item from one basket.
		// Splice returns an array of the deleted elements, just one in this case.
		const newChoice = votes.find((v) => v.name === choiceName)!;
		const oldChoice = votes.find((v) => v.name === data.choiceName)!;
		const [item] = oldChoice!.items.splice(data.itemIndex, 1);

		// Add the item to the drop target basket.
		newChoice!.items.push(item);
		votes = votes;

		hoveringOverBasket = null;
	}
</script>

<svelte:head>
	<title>DAOsim | Simulate Proposal {$page.params.dao}</title>
	<meta name="description" content="A DAO proposal simulator app" />
</svelte:head>

<section class="max-w-2xl w-full m-auto">
	<h1 class="text-4xl font-bold">Simulating Proposal: {$page.params.dao}</h1>

	<p>Drag addresses to yes or no to begin simulating.</p>

	<div class="py-5">
		{#each votes.filter((v) => v.name === 'Undecided') as choice, choiceIndex (choice)}
			<div animate:flip>
				<b>{choice.name}</b>
				<ul
					class="flex flex-row gap-4 border-2 border-gray-500 rounded-lg"
					class:hover:border-primary={hoveringOverBasket === choice.name}
					on:dragenter={() => (hoveringOverBasket = choice.name)}
					on:dragleave={() => (hoveringOverBasket = null)}
					on:drop={(event) => drop(event, choice.name)}
					ondragover="return false"
				>
					{#each choice.items as item, itemIndex (item)}
						<li
							class="block mr-2"
							animate:flip
							draggable={true}
							on:dragstart={(event) => dragStart(event, choice.name, itemIndex)}
						>
							<div>
								{item}
							</div>
						</li>
					{:else}
						<li class="block mr-2">
							<br />
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="py-5">
		<div class="grid grid-cols-2 gap-4">
			{#each votes.filter((v) => v.name === 'Yays') as choice, choiceIndex (choice)}
				<div animate:flip>
					<div>
						<h3 class="w-full text-center"><b>{choice.name}</b></h3>
					</div>
					<ul
						class="flex flex-col border-2 border-gray-500 rounded-lg"
						class:hover:border-primary={hoveringOverBasket === choice.name &&
							choice.items.length > 0}
						on:dragenter={() => (hoveringOverBasket = choice.name)}
						on:dragleave={() => (hoveringOverBasket = null)}
						on:drop={(event) => drop(event, choice.name)}
						ondragover="return false"
					>
						{#each choice.items as item, itemIndex (item)}
							<li
								class="block mr-2"
								animate:flip
								draggable={true}
								on:dragstart={(event) => dragStart(event, choice.name, itemIndex)}
							>
								<div>
									{item}
								</div>
							</li>
						{:else}
							<li class="block mr-2">
								<br />
							</li>
						{/each}
					</ul>
				</div>
			{/each}

			{#each votes.filter((v) => v.name === 'Nays') as choice, choiceIndex (choice)}
				<div animate:flip>
					<div>
						<h3 class="w-full text-center"><b>{choice.name}</b></h3>
					</div>
					<ul
						class="flex flex-col border-2 border-gray-500 rounded-lg"
						class:hover:border-primary={hoveringOverBasket === choice.name &&
							choice.items.length > 0}
						on:dragenter={() => (hoveringOverBasket = choice.name)}
						on:dragleave={() => (hoveringOverBasket = null)}
						on:drop={(event) => drop(event, choice.name)}
						ondragover="return false"
					>
						{#each choice.items as item, itemIndex (item)}
							<li
								class="block mr-2"
								animate:flip
								draggable={true}
								on:dragstart={(event) => dragStart(event, choice.name, itemIndex)}
							>
								<div>
									{item}
								</div>
							</li>
						{:else}
							<li class="block mr-2">
								<br />
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	ul {
		@apply flex border-2 p-2;
	}

	li {
		@apply cursor-pointer;
	}
</style>
