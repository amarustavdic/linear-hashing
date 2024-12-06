<script lang="ts">
	export let isOpen = false;
	export let onClose: () => void;
	export let onSubmit: (json: string) => void;

	let jsonInput = '';

	function handleSubmit() {
		onSubmit(jsonInput);
		jsonInput = ''; // Reset input after submission
		onClose(); // Close the modal
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg w-96">
			<h2 class="text-lg font-semibold text-gray-700 mb-4">Set Initial State</h2>

			<textarea
				bind:value={jsonInput}
				class="w-full h-40 border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
			></textarea>

			<div class="flex justify-end mt-4 gap-2">
				<button
					class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
					onclick={onClose}
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onclick={handleSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
{/if}
