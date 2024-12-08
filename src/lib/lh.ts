class Bucket {
	private readonly capacity: number;
	private entries: number[];
	private overflow: number[];

	constructor(capacity: number) {
		this.capacity = capacity;
		this.entries = [];
		this.overflow = [];
	}

	insert(key: number): boolean {
		if (this.entries.length < this.capacity) {
			this.entries.push(key);
			return true;
		} else {
			this.overflow.push(key);
			return false;
		}
	}
}

export class LinearHashingIndex {
	private readonly N: number; // Initial number of buckets
	private readonly bucketCapacity: number; // Max capacity of bucket
	private level: number; // Current round number
	private next: number; // Pointer to next bucket to be split
	private buckets: Bucket[];

	constructor(N = 4, level = 0, next = 0, bucketCapacity = 4) {
		this.N = N;
		this.level = level;
		this.next = next;
		this.bucketCapacity = bucketCapacity;
		this.buckets = Array.from({ length: this.N }, () => new Bucket(bucketCapacity));
	}

	/**
	 * Computes the hash value for a given key based on the specified level and the number of initial buckets (N).
	 *
	 * @param {number} key - The key to hash.
	 * @param {number} level - The hashing level, determining the current range of buckets.
	 * @returns {number} The hash value, which determines the bucket index.
	 *
	 * @remarks
	 * - The hash range grows dynamically with the formula `2^level * N`.
	 * - This value helps identify the appropriate bucket for the key.
	 *
	 * @example
	 * hash(5, 1); // Returns 5 % (2^1 * N)
	 */
	private hash(key: number, level: number): number {
		return key % (Math.pow(2, level) * this.N);
	}

	insert(key: number): void {
		// Determine the bucket for the key
		let bucketIndex: number = this.hash(key, this.level);
		if (bucketIndex < this.next) {
			bucketIndex = this.hash(key, this.level + 1);
		}

		// Insert the key into determined bucket
		const bucket: Bucket = this.buckets[bucketIndex];
		if (!bucket.insert(key)) {
			// If bucket is full, handle overflow and potentially split
		}
	}

	search() {}

	delete() {}
}
