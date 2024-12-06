<script lang="ts">
	import { LinearHashtable } from '$lib/LinearHashtable';
	import { writable } from 'svelte/store';

	const hashtableStore = writable(new LinearHashtable());

	let key = $state(0);


	const bits = (i: number, take: number): string => {
		const b = i.toString(2);
		const last = b.slice(-take);
		return last.padStart(take, '0');
	};
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


	<div class="grid bg-white rounded">
		<div class="grid grid-cols-[100px_100px_1fr_1fr] gap-4 items-center p-3">

			<!-- Hash Functions -->
			<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
				<span>h(1)</span>
				<span>h(0)</span>
			</div>

			<!-- Info Level -->
			<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
				<span>Level = {$hashtableStore.getLevel()}</span>
			</div>

			<!-- Info N -->
			<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
				<span>N = {$hashtableStore.getN()}</span>
			</div>


		</div>

		{#each $hashtableStore.getBuckets() as bucket, i}
			<div class="grid grid-cols-[100px_100px_1fr_1fr] gap-4 items-center p-3">

				<!-- Hash Functions -->
				<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
					<span>{bits(i, 3)}</span>
					<span>{bits(i, 2)}</span>
				</div>

				<!-- Next Pointer -->
				<div class="flex items-center justify-center">
					{#if i === $hashtableStore.getNext()}
						<span class="flex gap-2 text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded">
							<span>Next</span>
							<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path
								d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>
						</span>
					{/if}
				</div>

				<!-- Primary Pages -->
				<div class="flex min-w-36 min-h-10 flex-wrap items-center gap-2 bg-gray-50 border border-gray-300 p-2 rounded">
					{#if bucket.slice(0, 4).length > 0}
						{#each bucket.slice(0, 4) as item}
						<span class="inline-block px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded">
							{item}
						</span>
						{/each}
					{/if}
				</div>

				<!-- Overflow Pages -->
				<div class="flex min-w-36 min-h-10 flex-wrap items-center gap-2 bg-red-50 border border-gray-300 p-2 rounded">
					{#if bucket.slice(4).length > 0}
						{#each bucket.slice(4) as item}
						<span class="inline-block px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded">
							{item}
						</span>
						{/each}
					{/if}
				</div>
			</div>
		{/each}
	</div>


</div>