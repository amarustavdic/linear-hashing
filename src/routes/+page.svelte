<script lang="ts">
	import { LinearHashtable } from '$lib/hashlin';

	// Initialize the hashtable
	const table = new LinearHashtable(2);

	let newKey: number = $state(0);

	let primaryPages: number[][] = $state([]);
	table.primaryPages.subscribe((pages) => (primaryPages = pages));


	const insertKey = (): void => {
		table.insert(newKey);
		newKey = 0; // Reset input field
	};
</script>

<div class="flex flex-col gap-8 items-center justify-center w-screen h-screen bg-zinc-200">

	<!-- For inserting new key -->
	<div>
		<input type="number"
					 bind:value={newKey}
					 placeholder="Enter a key"
					 class="border border-gray-300 p-2 rounded"
		>
		<button
			class="px-3 py-2 border border-gray-300 rounded"
			onclick={insertKey}
		>insert
		</button>
	</div>

	<table class="min-w-96">
		<thead>
		<tr>
			<th>Hash Functions</th>
			<th>Primary Pages</th>
			<th>Overflow Pages</th>
		</tr>
		</thead>
		<tbody>
		{#each primaryPages as bucket}
			<tr>
				<td></td>
				<td>
					<div class="flex items-center justify-start px-2 gap-2 h-8 min-w-36 border border-gray-300 rounded">
						{#each bucket as item }
							<span class="flex items-center justify-center px-2">
								{item}
							</span>
						{/each}
					</div>
				</td>
				<td>

				</td>
			</tr>
		{/each}
		</tbody>
	</table>

</div>