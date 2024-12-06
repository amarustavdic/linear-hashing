<script lang="ts">
	import { hashtableStore } from '$lib/LinearHashtable';

	let key = $state(0);
</script>

<div class="flex flex-col gap-8 items-center justify-center w-screen h-screen bg-zinc-200">

	<!-- For inserting new key -->
	<div>
		<input
			type="number"
			onkeydown={(event: KeyboardEvent) => {
				if (event.key === 'Enter') {
					// Update the hashtable reactively
					hashtableStore.update((hashtable) => {
						hashtable.insert(key);
						return hashtable; // Trigger reactivity by reassigning
					});
					key = 0; // Reset the input field after insertion
				}
			}}
			bind:value={key}
			placeholder="Enter a key"
			class="border border-gray-300 p-2 rounded"
		>
		<button
			class="px-3 py-2 border border-gray-300 rounded"
			onclick={() => {
				// Update the hashtable reactively
				hashtableStore.update((hashtable) => {
					hashtable.insert(key);
					return hashtable; // Trigger reactivity by reassigning
				});
				key = 0;
			}}
		>insert
		</button>
	</div>


	<div class="grid gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
		{#each $hashtableStore.getBuckets() as bucket, i}
			<div class="grid grid-cols-[100px_100px_1fr_2fr] gap-4 items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm">

				<!-- Hash Functions -->
				<div class="text-gray-700 text-sm font-medium text-center">
					Hash {i}
				</div>

				<!-- Next Pointer -->
				<div class="flex items-center justify-center">
					{#if i === $hashtableStore.getNext()}
						<span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Next →</span>
					{/if}
				</div>

				<!-- Primary Pages -->
				<div class="flex flex-wrap items-center gap-2 bg-gray-50 border border-gray-300 p-2 rounded">
					{#if bucket.slice(0, 4).length > 0}
						{#each bucket.slice(0, 4) as item}
						<span class="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded">
							{item}
						</span>
						{/each}
					{:else}
						<span class="text-gray-400 text-sm">No Primary Pages</span>
					{/if}
				</div>

				<!-- Overflow Pages -->
				<div class="flex flex-wrap items-center gap-2 bg-red-50 border border-gray-300 p-2 rounded">
					{#if bucket.slice(4).length > 0}
						{#each bucket.slice(4) as item}
						<span class="inline-block px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded">
							{item}
						</span>
						{/each}
					{:else}
						<span class="text-gray-400 text-sm">No Overflow Pages</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>


</div>