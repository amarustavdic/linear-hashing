<script lang="ts">
	import { LinearHashIndex } from '$lib/LinearHashtableIndex';
	import { writable } from 'svelte/store';
	import Modal from '$lib/components/Modal.svelte';
	import IndexState from '$lib/components/IndexState.svelte';

	// Reactive store for LinearHashIndex
	const lhi = writable(new LinearHashIndex());

	let key = $state(0); // Input key for insertion
	let showModal = $state(false); // Modal visibility state

	// Function to initialize the table from JSON input
	function initializeTable(json: string) {
		try {
			const data = JSON.parse(json);

			// Validate JSON structure
			if (!Array.isArray(data.buckets) || typeof data.next !== 'number' || typeof data.level !== 'number') {
				throw new Error('Invalid JSON structure');
			}

			// Set the LinearHashIndex with the parsed JSON data
			lhi.set(new LinearHashIndex(data));
		} catch (error) {
			alert('Invalid JSON. Please check your input and try again.');
		}
	}

	// Function to insert keys into the hash table
	function insertKey() {
		lhi.update((hashtable) => {
			hashtable.insert(key);
			return hashtable;
		});
		key = 0; // Reset input field
	}
</script>

<!-- Modal Component -->
<Modal
	isOpen={showModal}
	onClose={() => (showModal = false)}
	onSubmit={initializeTable}
/>

<div class="flex flex-col gap-8 items-center justify-center w-screen h-screen bg-gray-200 p-4">
	<!-- Header Section -->
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-2xl font-bold text-gray-800">Linear Hash Index Visualization</h1>
		<p class="text-sm text-gray-500">
			Dynamically visualize and interact with a Linear Hash Index.
		</p>
	</div>

	<!-- Key Insertion Section -->
	<div class="flex gap-4 items-center">
		<input
			type="number"
			bind:value={key}
			placeholder="Enter a key"
			class="border border-gray-300 p-2 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
			onkeydown={(event: KeyboardEvent) => {
                if (event.key === 'Enter') insertKey();
            }}
		>
		<button
			class="px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
			onclick={insertKey}
		>
			Insert
		</button>
		<button
			class="px-4 py-2 rounded bg-green-700 text-white font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300"
			onclick={() => (showModal = true)}
		>
			Initialize
		</button>
	</div>

	<!-- Index State Visualization -->
	<IndexState
		level={$lhi.getLevel()}
		n={$lhi.getN()}
		next={$lhi.getNext()}
		buckets={$lhi.getBuckets()}
	/>
</div>
