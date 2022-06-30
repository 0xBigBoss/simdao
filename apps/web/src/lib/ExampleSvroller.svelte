<script>
	import { Svrollbar } from 'svrollbar';

	const items = Array.from({ length: 50 }).map((_, i) => `item ${i}`);

	let viewport;
	let contents;
</script>

<div class="wrapper">
	<div bind:this={viewport} class="viewport">
		<div bind:this={contents} class="contents">
			{#each items as item (item)}
				<div>{item}</div>
			{/each}
		</div>
	</div>
	<Svrollbar {viewport} {contents} />
</div>

<style>
	.wrapper {
		position: relative;
		width: 10rem;
	}

	.viewport {
		position: relative;
		width: 10rem;
		height: 10rem;
		overflow: scroll;
		border: 1px solid gray;
		box-sizing: border-box;

		/* hide scrollbar */
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.viewport::-webkit-scrollbar {
		/* hide scrollbar */
		display: none;
	}
</style>
