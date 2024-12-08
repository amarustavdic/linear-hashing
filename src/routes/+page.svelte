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

<div class="w-screen h-screen box-border flex flex-col p-2 items-center justify-between">
	<!-- State of Linear Hashing Index -->
	<div class="w-full min-w-80 grid grid-cols-4 gap-2 p-2 rounded">

		<!-- Hint -->
		<div class="flex gap-4 items-center justify-center">
			<div>h(1)</div>
			<div>h(0)</div>
		</div>
		<div class="flex items-center justify-center">
			Level = {metadata.level}
		</div>
		<div class="flex items-center justify-start">
			N = {metadata.N}
		</div>
		<div></div>

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
			<div class="flex items-center justify-start gap-2 border border-slate-400 rounded px-2 min-h-5 overflow-auto">
				{#each bucket.entries as value}
					<div class="">
						{value}
					</div>
				{/each}
			</div>

			<!-- Overflow Pages -->
			<div class="flex items-center justify-start gap-2 border border-slate-400 rounded px-2 min-h-5 overflow-auto">
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
			class="border border-slate-400 rounded w-full h-full" type="number" name="" id=""
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
