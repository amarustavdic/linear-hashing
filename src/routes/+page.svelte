<script lang="ts">
	import { LinearHashingIndex } from '$lib/LinearHashingIndex';

	const lh = new LinearHashingIndex({ N: 4 });

	// Binary formatter for index values
	const bits = (i: number, take: number): string => {
		const b = i.toString(2);
		const last = b.slice(-take);
		return last.padStart(take, '0');
	};

	let metadata = $state(lh.getMetadata());
	let data = $state(lh.getState());

	let key = $state(0);

	const handleInsert = () => {
		lh.insert(key);
		metadata = lh.getMetadata();
		data = lh.getState();
	};

</script>

<div class="w-screen h-screen box-border flex flex-col gap-4 p-2 items-center justify-start">

	<!-- Project Info -->
	<div class="w-full p-4 bg-blue-100 rounded shadow">
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


	<!-- State of Linear Hashing Index -->
	<div class="w-full min-w-80 grid grid-cols-4 gap-2 p-2 rounded bg-zinc-200">

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
	<div class="flex gap-2 items-center justify-between">
		<input
			class="px-2 border border-slate-400 rounded w-full h-full" type="number" name="" id=""
			bind:value={key}
		>
		<button
			class="bg-blue-300 flex px-4 py-2 rounded box-border font-medium"
			onclick={handleInsert}
		>Insert
		</button>
		<button class="bg-red-300 flex px-4 py-2 rounded box-border font-medium">Delete</button>
	</div>

</div>
