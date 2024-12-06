<script lang="ts">
	import { LinearHashtable } from '$lib/LinearHashtable';

	const table = new LinearHashtable();

	let key = $state(0);
</script>

<div class="flex flex-col gap-8 items-center justify-center w-screen h-screen bg-zinc-200">

	<!-- For inserting new key -->
	<div>
		<input
			type="number"
			onkeydown={(event: KeyboardEvent) => {
				if (event.key === 'Enter') {
					table.insert(key);
					key = 0; // Reset the input field after insertion
				}
			}}
			bind:value={key}
			placeholder="Enter a key"
			class="border border-gray-300 p-2 rounded"
		>
		<button
			class="px-3 py-2 border border-gray-300 rounded"
			onclick={() => table.insert(key)}
		>insert
		</button>
	</div>

	{#each table.getBuckets() as bucket}
		{bucket.toString()}
	{/each}
</div>