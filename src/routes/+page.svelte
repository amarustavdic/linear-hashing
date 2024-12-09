<script lang="ts">
	import { LinearHashingIndex } from '$lib/LinearHashingIndex';

	let lh = new LinearHashingIndex({ N: 4 });

	// Binary formatter for index values
	const bits = (i: number, take: number): string => {
		const b = i.toString(2);
		const last = b.slice(-take);
		return last.padStart(take, '0');
	};

	let metadata = $state(lh.getMetadata());
	let data = $state(lh.getState());

	let key = $state(0);

	let triggerType: 'overflow' | 'load' = $state('overflow');
	let loadThreshold = $state(0.75);
	let currentLoad = $state(0);

	const handleTriggerTypeChange = () => {
		lh = new LinearHashingIndex({ N: 4, triggerType: triggerType, capacityThreshold: loadThreshold });
		metadata = lh.getMetadata();
		data = lh.getState();
	};

	const handleInsert = () => {
		lh.insert(key);
		metadata = lh.getMetadata();
		data = lh.getState();
		currentLoad = lh.getLoad();
		key = 0;

		console.log(JSON.stringify(lh))
	};


	// for modal control
	let isModal = $state(false);

</script>

<div class="w-screen h-screen box-border flex flex-col gap-4 p-2 items-center justify-start">

	<!-- Project Info -->
	<div class="w-full p-4 bg-blue-100 rounded shadow max-w-[768px] shadow-md">
		<h1 class="text-3xl font-bold mb-2 text-blue-700">Linear Hashing Index</h1>
		<p class="text-base text-blue-700">
			This tool helps you understand how the dynamic Linear Hashing algorithm works,
			particularly in database systems. You can explore how data is distributed across buckets,
			how overflows are managed, and how splits occur incrementally.
		</p>
		<ul class="list-disc list-inside mt-4 text-blue-700 text-sm">
			<li>Insert numbers to populate the hash table.</li>
			<li>View primary and overflow pages of buckets.</li>
			<li>Visualize bucket splits and level changes.</li>
		</ul>
	</div>

	<div class="space-y-4 max-w-[768px] w-full">
		<!-- Split Trigger Selection -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<label for="split-trigger" class="block font-semibold text-gray-800">Select Split Trigger</label>
			<select
				id="split-trigger"
				class="block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
				bind:value={triggerType}
				onchange={handleTriggerTypeChange}
			>
				<option value="overflow">Overflow</option>
				<option value="load">Load</option>
			</select>
		</div>

		<!-- Load Threshold Input -->
		{#if triggerType === 'load'}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<label for="load-threshold" class="block font-semibold text-gray-800">Set Load Threshold</label>
				<input
					type="number"
					id="load-threshold"
					min="0.1"
					max="1"
					step="0.1"
					placeholder="Enter threshold (e.g., 0.75)"
					class="block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
					bind:value={loadThreshold}
					onchange={handleTriggerTypeChange}
				/>
			</div>
		{/if}

		<!-- Current Load -->
		{#if triggerType === 'load'}
			<div class="text-gray-700 text-sm">
				Current Load: <span class="font-semibold">{currentLoad}</span>
			</div>
		{/if}
	</div>


	<!-- State of Linear Hashing Index -->
	<div class="w-full min-w-80 grid grid-cols-4 gap-2 p-2 rounded bg-zinc-100 max-w-[768px] shadow-md">

		<!-- Hint -->
		<div class="flex gap-4 items-center justify-center">
			<div>h(1)</div>
			<div>h(0)</div>
		</div>
		<div class="flex gap-2 items-center justify-center">
			<span>
				L: {metadata.level}
			</span>
			<span>
				N: {metadata.N}
			</span>
		</div>
		<div class="flex items-center justify-center font-medium text-sm">
			PRIMARY
		</div>
		<div class="flex items-center justify-center font-medium text-sm">
			OVERFLOW
		</div>

		{#each data.buckets as bucket, i}

			<div class="flex gap-4 items-center justify-center">
				<div>{bits(i, 3)}</div>
				<div>{bits(i, 2)}</div>
			</div>

			<div>
				{#if bucket.next}
					<div class="flex gap-2 items-center justify-center h-full">
						<span class="font-medium">next</span>
						<svg class="w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="m18 8l4 4l-4 4M2 12h20" />
						</svg>
					</div>
				{/if}
			</div>

			<!-- Primary Pages -->
			<div class="flex items-center justify-start gap-2 border border-slate-500 rounded px-2 min-h-5 overflow-auto">
				{#each bucket.entries as value}
					<div class="">
						{value}
					</div>
				{/each}
			</div>

			<!-- Overflow Pages -->
			<div class="flex items-center justify-start gap-2 border border-slate-500 rounded px-2 min-h-5 overflow-auto">
				{#each bucket.overflow as value}
					<div class="">
						{value}
					</div>
				{/each}
			</div>

		{/each}
	</div>

	<!-- Controls -->
	<div class="flex flex-col md:flex-row gap-4 items-center w-full max-w-[768px] p-4 bg-gray-100 rounded shadow-md">
		<!-- Input and Action Buttons -->
		<div class="flex gap-2 items-center w-full md:flex-1">
			<input
				class="px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:ring-blue-300"
				type="number"
				name=""
				id=""
				placeholder="Enter key"
				bind:value={key}
			>
			<button
				class="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
				onclick={handleInsert}
			>Insert
			</button>
			<button
				class="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
			>Delete
			</button>
		</div>

		<!-- Load State Button -->
		<button
			class="bg-gray-800 text-white px-6 py-2 rounded font-medium hover:bg-gray-900 focus:outline-none focus:ring focus:ring-gray-400"
		onclick={() => isModal = true}
		>
			Load State
		</button>
	</div>

</div>


<!-- Modal for setting state -->
{#if isModal}
	<!-- Modal Overlay -->
	<div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
		<!-- Modal Container -->
		<div class="bg-white rounded shadow-lg w-[90%] max-w-2xl p-4 flex flex-col md:flex-row gap-4">
			<!-- JSON Example (Help Section) -->
			<div class="md:w-1/2 space-y-2">
				<h2 class="text-lg font-semibold text-gray-800">Example JSON</h2>
				Not working yet.
				<pre class="bg-gray-100 p-2 rounded text-sm text-gray-700 overflow-auto">
					<code>


					</code>
				</pre>
			</div>

			<!-- JSON Input Section -->
			<div class="md:w-1/2">
				<h2 class="text-lg font-semibold text-gray-800">Set State</h2>
				<textarea
					placeholder="Paste JSON here..."
					class="w-full h-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 text-sm"
				></textarea>
				<div class="flex justify-end mt-4 gap-2">
					<button
						class="px-4 py-2 bg-gray-300 rounded text-gray-700 font-medium hover:bg-gray-400"
						onclick={() => isModal = false}
					>
						Cancel
					</button>
					<button
						class="px-4 py-2 bg-blue-500 rounded text-white font-medium hover:bg-blue-600"
					>
						Set State
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}





