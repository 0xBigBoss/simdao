<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	let daoName = 'pokt-network';

	const lookupDao = async () => {
		window.location.href = '/simulate/' + daoName;
	};
</script>

<svelte:head>
	<title>simDAO | simulator for DAO governance voting</title>
	<meta name="description" content="A DAO proposal simulator app" />
</svelte:head>

<section>
	<div class="hero min-h-screen bg-base-200">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">simDAO</h1>
				<p class="py-6">
					An open-source simulator for DAO governance voting. Start by choosing a DAO
					to simulate a proposal. Enter the <a href="https://snapshot.org/" target="_blank"
						>Snapshot.org</a
					> space ID below.
				</p>

				<form on:submit|preventDefault={lookupDao} class="w-full">
					<div class="form-control w-full">
						<div class="input-group flex w-full">
							<input
								type="text"
								placeholder="dao.eth"
								bind:value={daoName}
								class="input input-bordered flex w-full"
							/>
							<button class="btn btn-square">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/></svg
								>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
</style>
