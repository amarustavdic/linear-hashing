<script lang="ts">
	export let isOpen = false;
	export let onClose: () => void;
	export let onSubmit: (json: string) => void;

	let jsonInput = '';

	// Example JSON
	const exampleJson = JSON.stringify(
		{
			buckets: [
				{ keys: [8, 40, 64, 96] },
				{ keys: [9, 17] },
				{ keys: [2, 46, 10] },
				{ keys: [7, 11, 23, 39] },
				{ keys: [60, 4] },
				{ keys: [29, 14, 5] },
			],
			next: 2,
			level: 1,
			N: 4,
			maxBucketSize: 4,
		},
		null,
		2 // Indentation level
	);

	function handleSubmit() {
		onSubmit(jsonInput);
		jsonInput = ''; // Reset input after submission
		onClose(); // Close the modal
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
			<h2 class="text-lg font-semibold text-gray-700 mb-4">Set Initial State</h2>

			<div class="grid grid-cols-2 gap-4">
				<!-- JSON Input Field -->
				<div>
					<h3 class="text-md font-medium text-gray-600 mb-2">Enter JSON</h3>
					<textarea
						bind:value={jsonInput}
						class="w-full h-64 border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
						placeholder='Paste or write JSON here'
					></textarea>
				</div>

				<!-- Example JSON and Explanation -->
				<div>
					<h3 class="text-md font-medium text-gray-600 mb-2">Example JSON</h3>
					<pre class="w-full h-64 bg-gray-100 border border-gray-300 rounded p-4 overflow-auto text-sm text-gray-800">
{exampleJson}
					</pre>
					<p class="text-sm text-gray-500 mt-2">
						<b>Explanation:</b> The <code>"buckets"</code> array contains the current keys stored in each bucket.
						The <code>"next"</code> field specifies the next bucket to split, <code>"level"</code> represents
						the current level of the hash index, <code>"N"</code> is the initial number of buckets (must be a power of 2),
						and <code>"maxBucketSize"</code> sets the maximum number of keys per bucket.
					</p>
				</div>
			</div>

			<!-- Buttons -->
			<div class="flex justify-end mt-4 gap-2">
				<button
					class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
					onclick={onClose}
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
					onclick={handleSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
{/if}
