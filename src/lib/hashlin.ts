import { writable } from 'svelte/store';

export class LinearHashtable {

	private level: number; // Indicates the current round number (initially 0)
	private next: number; // Next bucket to split (initially 0)
	private N: number; // Number of buckets

	private bucketSize: number; // Max bucket size, max pages in bucket
	public primaryPages = writable<number[][]>([]);
	public overflowPages = writable<{ [key: number]: number[] }>({});


	constructor(N = 2, bucketSize = 4) {
		this.level = 0;
		this.next = 0;
		this.N = N;
		this.bucketSize = bucketSize;
		this.primaryPages.set(Array.from({ length: N }, () => []));
		this.overflowPages.set({});
	}

	hash(key: number) {
		return key % (Math.pow(2, this.level) * this.N);
	}

	insert(key: number) {
		this.primaryPages.update((pages) => {
			const index = this.hash(key);

			if (pages[index].length < this.bucketSize) {
				// Add the key to the primary bucket
				console.log(pages[index].length)
				pages[index].push(key);
			} else {
				// Add to overflow and make it reactive
				this.overflowPages.update((overflow) => {
					if (!overflow[index]) {
						overflow[index] = [];
					}
					overflow[index].push(key);
					return overflow;
				});

				//
				// if (index === this.next) {
				// 	this.split(pages);
				// }
			}
			return pages;
		});
	}

	private split(pages: number[][]) {
		// Create a new bucket
		pages.push([]);

		// TODO: Fix the problem bellow somewhere

		// Get the bucket to split
		const bucketToSplit = pages[this.next];
		const overflowKeys = this.overflowPages[this.next] || [];
		delete this.overflowPages[this.next];

		// Rehash keys
		const allKeys = [...bucketToSplit, ...overflowKeys];
		pages[this.next] = [];

		for (const key of allKeys) {
			const newIndex = this.hash(key);
			if (newIndex === this.next) {
				pages[this.next].push(key);
			} else {
				pages[newIndex].push(key);
			}
		}

		// Move to the next bucket
		this.next++;

		// If we've completed a round, reset `next` and increase `level`
		if (this.next === Math.pow(2, this.level)) {
			this.next = 0;
			this.level++;
		}
	}



	getPrimaryPages() {
		return this.primaryPages;
	}

	getOverflowPages() {
		return this.overflowPages;
	}

}