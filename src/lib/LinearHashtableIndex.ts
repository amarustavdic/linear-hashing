interface BucketData {
	keys: number[]; // An array of numbers representing the keys in the bucket
}

interface LinearHashIndexData {
	buckets: BucketData[]; // An array of BucketData objects
	next: number;          // The next bucket to split
	level: number;         // The current level of hashing
	N: number;             // Initial number of buckets (must be a power of 2)
	maxBucketSize: number; // Maximum size of a bucket before splitting or overflow
}

class Bucket {
	private keys: number[];
	private overflow: Bucket | null;

	constructor() {
		this.keys = [];
		this.overflow = null;
	}

	insert(key: number, maxSize: number): void {
		if (this.keys.length < maxSize) {
			// Insert into the current bucket
			this.keys.push(key);
		} else {
			// Delegate to overflow bucket
			if (!this.overflow) {
				this.overflow = new Bucket(); // Allocate a new overflow page
			}
			this.overflow.insert(key, maxSize);
		}
	}

	search(key: number): boolean {
		if (this.keys.includes(key)) {
			return true; // Found in the current bucket
		}
		return this.overflow ? this.overflow.search(key) : false; // Check overflow
	}

	getAllKeys(): number[] {
		// Collect keys from this bucket and all overflow buckets
		return this.keys.concat(this.overflow ? this.overflow.getAllKeys() : []);
	}

	clear(): void {
		this.keys = [];
		if (this.overflow) {
			this.overflow.clear();
			this.overflow = null;
		}
	}
}

export class LinearHashIndex {
	private readonly N: number; // Initial number of buckets
	private readonly maxBucketSize: number;
	private level: number; // Current round
	private next: number;
	private buckets: Bucket[];

	constructor(
		data: {
			buckets?: number[];
			next?: number;
			level?: number;
			N?: number;
			maxBucketSize?: number;
		} = {}
	) {
		const {
			buckets = [], // Default: empty array for buckets
			next = 0, // Default: 0 for next
			level = 0, // Default: 0 for level
			N = 2, // Default: 2 for initial number of buckets
			maxBucketSize = 4 // Default: 4 for bucket size
		} = data;

		// Ensure N is a power of 2 and non-negative
		if (N <= 0 || (N & (N - 1)) !== 0) {
			throw new Error('N must be a positive power of 2.');
		}

		// Ensure level is non-negative
		if (level < 0) {
			throw new Error('level must be non-negative.');
		}

		// Ensure next is non-negative
		if (next < 0) {
			throw new Error('next must be non-negative.');
		}

		// Ensure maxBucketSize is positive
		if (maxBucketSize <= 0) {
			throw new Error('maxBucketSize must be greater than 0.');
		}

		this.N = N;
		this.level = level;
		this.next = next;
		this.maxBucketSize = maxBucketSize;

		// Initialize buckets
		this.buckets =
			buckets.length > 0
				? buckets.map((bucketData) => {
						const bucket = new Bucket();
						// Initialize the bucket if additional logic is required
						// Example: populate keys in bucket from bucketData if needed
						bucket.keys = bucketData.keys || [];
						return bucket;
					})
				: Array.from({ length: this.N }, () => new Bucket()); // Default buckets
	}

	/**
	 * Computes the hash value for a given key based on the current or next level.
	 *
	 * @param key - The key to hash.
	 * @param useNextLevel - If true, uses the next level hash function.
	 * @returns The bucket index.
	 * @private
	 */
	private hash(key: number, useNextLevel = false): number {
		const effectiveLevel = useNextLevel ? this.level + 1 : this.level;
		return key % (Math.pow(2, effectiveLevel) * this.N);
	}

	/**
	 * Inserts a key into the hash table.
	 *
	 * @param key - The key to insert.
	 */
	insert(key: number): void {
		// Check if the key is a valid number
		if (typeof key !== 'number' || isNaN(key)) {
			console.warn('Invalid key: The key must be a valid number.');
			return; // Exit the method early
		}

		// Determine the bucket index
		let bucketIndex = this.hash(key);
		if (bucketIndex < this.next) {
			bucketIndex = this.hash(key, true);
		}

		// Insert the key into the determined bucket
		this.buckets[bucketIndex].insert(key, this.maxBucketSize);

		// Check if the bucket overflows, trigger a split
		if (this.buckets[bucketIndex].getAllKeys().length > this.maxBucketSize) {
			this.split();
		}
	}

	/**
	 * Splits the next bucket and redistributes keys.
	 */
	private split(): void {
		// Create a new bucket
		this.buckets.push(new Bucket());

		// Redistribute keys from the bucket being split
		const oldKeys = this.buckets[this.next].getAllKeys();
		this.buckets[this.next].clear();

		for (const key of oldKeys) {
			// Rehash keys to determine their new bucket
			const bucketIndex = this.hash(key, true);
			this.buckets[bucketIndex].insert(key, this.maxBucketSize);
		}

		// Update the next pointer and level
		this.next++;
		if (this.next >= Math.pow(2, this.level) * this.N) {
			this.level++;
			this.next = 0;
		}
	}

	/**
	 * Searches for a key in the hash table.
	 *
	 * @param key - The key to search for.
	 * @returns True if the key exists, false otherwise.
	 */
	search(key: number): boolean {
		// Determine the bucket index
		let bucketIndex = this.hash(key);
		if (bucketIndex < this.next) {
			bucketIndex = this.hash(key, true);
		}

		// Search in the bucket
		return this.buckets[bucketIndex].search(key);
	}

	/**
	 * Gets all keys from the hash table for debugging or visualization.
	 *
	 * @returns An array of arrays, where each sub-array contains the keys in a bucket.
	 */
	getBuckets(): number[][] {
		return this.buckets.map((bucket) => bucket.getAllKeys());
	}

	getLevel(): number {
		return this.level;
	}

	getNext(): number {
		return this.next;
	}

	getN(): number {
		return this.N;
	}
}