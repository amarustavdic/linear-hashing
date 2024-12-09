type TriggerType = 'overflow' | 'load';

export class LinearHashingIndex {
	private readonly N: number; // Initial number of buckets
	private level: number; // Current round number
	private next: number; // Pointer to next bucket to be split
	private maxBucketSize: number; // Maximum size of a single bucket
	private capacityThreshold: number; // Threshold for triggering splits
	private totalEntries: number; // Total number of entries in the hash table
	private buckets: Map<number, number[]>;
	private triggerType: TriggerType; // Chosen trigger type

	constructor(
		data: {
			N?: number;
			maxBucketSize?: number;
			capacityThreshold?: number;
			triggerType?: TriggerType;
		} = {}
	) {
		this.N = data.N ?? 2;
		this.level = 0;
		this.next = 0;
		this.maxBucketSize = data.maxBucketSize ?? 4;
		this.capacityThreshold = data.capacityThreshold ?? 0.75;
		this.totalEntries = 0;
		this.buckets = new Map();
		this.triggerType = data.triggerType ?? 'overflow'; // Default to 'overflow'

		// Initialize buckets
		for (let i = 0; i < this.N; i++) {
			this.buckets.set(i, []);
		}
	}

	private hash(key: number, level: number): number {
		return key % (Math.pow(2, level) * this.N);
	}

	insert(key: number): void {
		// Determine the bucket for the key
		let bucketIndex = this.hash(key, this.level);
		if (bucketIndex < this.next) {
			bucketIndex = this.hash(key, this.level + 1);
		}

		// Insert into the bucket
		const bucket = this.buckets.get(bucketIndex)!;
		bucket.push(key);
		this.totalEntries++;

		// Trigger split based on the chosen trigger type
		if (this.triggerType === 'overflow') {

			if (bucket.length > this.maxBucketSize) {
				console.log('overflow triggered split');
				this.split();
			}
		} else if (this.triggerType === 'load') {
			if (this.getLoadFactor() > this.capacityThreshold) {

				console.log('load triggered split', this.getLoadFactor());
				this.split();
			}
		}
	}

	private getLoadFactor(): number {
		const currentBucketCount = Math.pow(2, this.level) * this.N;
		return this.totalEntries / (currentBucketCount * this.maxBucketSize);
	}

	private split(): void {
		// Get the bucket to split
		const bucketToSplit = this.buckets.get(this.next)!;

		// Create a new bucket for the split
		const newBucketIndex = this.buckets.size;
		this.buckets.set(newBucketIndex, []);

		// Redistribute entries between the old and new bucket
		const redistributedKeys: number[] = [];
		for (const key of bucketToSplit) {
			const newBucketIndexForKey = this.hash(key, this.level + 1);
			if (newBucketIndexForKey === this.next) {
				redistributedKeys.push(key);
			} else {
				this.buckets.get(newBucketIndex)!.push(key);
			}
		}

		this.buckets.set(this.next, redistributedKeys);

		// Increment 'next' and check if a new round starts
		this.next++;
		if (this.next === Math.pow(2, this.level) * this.N) {
			this.next = 0;
			this.level++;
		}
	}

	search(key: number): boolean {
		let bucketIndex = this.hash(key, this.level);
		if (bucketIndex < this.next) {
			bucketIndex = this.hash(key, this.level + 1);
		}

		const bucket = this.buckets.get(bucketIndex)!;
		return bucket.includes(key);
	}

	delete(key: number): boolean {
		// Determine the bucket for the key
		let bucketIndex = this.hash(key, this.level);
		if (bucketIndex < this.next) {
			bucketIndex = this.hash(key, this.level + 1);
		}

		const bucket = this.buckets.get(bucketIndex);

		// If the bucket exists, attempt to delete the key
		if (bucket) {
			const index = bucket.indexOf(key);
			if (index !== -1) {
				bucket.splice(index, 1); // Remove the key from the bucket
				this.totalEntries--;
				return true;
			}
		}

		// Return false if the key was not found
		return false;
	}

	// Getters and setters
	getState() {
		return {
			buckets: Array.from(this.buckets.entries()).map(([index, bucket]) => {
				const entries = bucket.slice(0, this.maxBucketSize); // Primary entries
				const overflow = bucket.slice(this.maxBucketSize); // Overflow entries
				return {
					next: index === this.next, // Is this the next bucket to split?
					entries,
					overflow
				};
			})
		};
	}

	getMetadata() {
		return {
			N: this.N,
			level: this.level
		};
	}

	getLoad() {
		return this.getLoadFactor();
	}
}
