<script lang="ts">

	interface Props {
		level: number; // Current level of the hash table
		n: number; // Initial number of buckets
		next: number; // Next bucket to split
		buckets: number[][]; // Array of bucket data
	}

	let { level, n, next, buckets }: Props = $props();


	// Binary formatter for index values
	const bits = (i: number, take: number): string => {
		const b = i.toString(2);
		const last = b.slice(-take);
		return last.padStart(take, '0');
	};

</script>

<div class="index-state bg-white rounded shadow-md p-4">
	<!-- Header Information -->
	<div class="grid grid-cols-[100px_100px_1fr_1fr] gap-4 items-center p-3">
		<!-- Hash Functions Header -->
		<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
			<span>h(1)</span>
			<span>h(0)</span>
		</div>

		<!-- Level Information -->
		<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
			<span>Level = {level}</span>
		</div>

		<!-- N Information -->
		<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
			<span>N = {n}</span>
		</div>
	</div>

	<!-- Bucket Rows -->
	{#each buckets as bucket, i}
		<div class="grid grid-cols-[100px_100px_1fr_1fr] gap-4 items-center p-3 border-t">
			<!-- Hash Functions -->
			<div class="flex items-center justify-center gap-8 text-gray-700 text-sm font-medium text-center">
				<span>{bits(i, 3)}</span>
				<span>{bits(i, 2)}</span>
			</div>

			<!-- Next Pointer -->
			<div class="flex items-center justify-center">
				{#if i === next}
                    <span class="flex gap-2 text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded shadow">
                        <span>Next</span>
                        <svg
													class="w-4 h-4"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
                            <path
															d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
														></path>
                        </svg>
                    </span>
				{/if}
			</div>

			<!-- Primary Pages -->
			<div class="flex min-w-36 min-h-10 flex-wrap items-center gap-2 bg-gray-50 border border-gray-300 p-2 rounded">
				{#each bucket.slice(0, 4) as item}
                    <span class="inline-block px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded shadow">
                        {item}
                    </span>
				{/each}
			</div>

			<!-- Overflow Pages -->
			<div class="flex min-w-36 min-h-10 flex-wrap items-center gap-2 bg-red-50 border border-gray-300 p-2 rounded">
				{#each bucket.slice(4) as item}
                    <span class="inline-block px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded shadow">
                        {item}
                    </span>
				{/each}
			</div>
		</div>
	{/each}
</div>
