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
}

class LinearHashIndex {
	private N: number; // Initial number of buckets
	private level: number;
	private next: number;
	private maxBucketSize: number;

	constructor(N = 2, level = 0, next = 0, maxBucketSize = 4) {
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

		// Ensure maxBucketSize is non-negative
		if (maxBucketSize < 0) {
			throw new Error('maxBucketSize must be non-negative.');
		}

		this.N = N;
		this.level = level;
		this.next = next;
		this.maxBucketSize = maxBucketSize;
	}

	/**
	 * Each round h_i and h_i+1 (for that there is useNextLevel flag) is used.
	 *
	 * @param key
	 * @param useNextLevel - this one is used to rehash values for the split bucket.
	 * @private
	 */
	private hash(key: number, useNextLevel = false): number {
		const effectiveLevel = useNextLevel ? this.level + 1 : this.level;
		return key % (Math.pow(2, effectiveLevel) * this.N);
	}



}
