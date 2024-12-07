<script lang="ts">
	import { LinearHashIndex } from '$lib/LinearHashtableIndex';
	import { writable } from 'svelte/store';
	import Modal from '$lib/Modal.svelte';
	import IndexState from '$lib/components/IndexState.svelte';

	const lhi = writable(new LinearHashIndex());

	let key = $state(0);
	let showModal = $state(false);

	function initializeTable(json: string) {
		try {
			const data = JSON.parse(json);

			// Validate JSON structure
			if (!Array.isArray(data.buckets) || typeof data.next !== 'number' || typeof data.level !== 'number') {
				throw new Error('Invalid JSON structure');
			}

			// Create a new LinearHashtable instance
			lhi.set(new LinearHashIndex(data));
		} catch (error) {
			alert('Invalid JSON. Please check your input and try again.');
		}
	}
</script>

<!-- Modal Component -->
<Modal
	isOpen={showModal}
	onClose={() => (showModal = false)}
	onSubmit={initializeTable}
/>


<div class="flex flex-col gap-8 items-center justify-center w-screen h-screen bg-zinc-200">

	<!-- For inserting new key -->
	<div>
		<input
			type="number"
			onkeydown={(event: KeyboardEvent) => {
				if (event.key === 'Enter') {
					// Update the hashtable reactively
					lhi.update((hashtable) => {
						hashtable.insert(key);
						return hashtable; // Trigger reactivity by reassigning
					});
					key = 0; // Reset the input field after insertion
				}
			}}
			bind:value={key}
			placeholder="Enter a key"
			class="border border-gray-300 p-2 rounded max-w-24"
		>
		<button
			class="px-3 py-2 border font-medium border-gray-300 rounded bg-blue-200"
			onclick={() => {
				// Update the hashtable reactively
				lhi.update((hashtable) => {
					hashtable.insert(key);
					return hashtable; // Trigger reactivity by reassigning
				});
				key = 0;
			}}
		>insert
		</button>

		<!-- Set initial state -->
		<button
			onclick={() => showModal = true}
			class="px-3 py-2 border font-medium border-gray-300 rounded bg-green-200"
		>
			initialize
		</button>
	</div>

	<IndexState level={$lhi.getLevel()} n={$lhi.getN()} next={$lhi.getNext()} buckets={$lhi.getBuckets()}  />

</div>