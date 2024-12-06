type Bucket = number[];

export class LinearHashtable {
	private level: number; // Current round number
	private next: number; // Next bucket to split
	private N: number; // Number of buckets
	private bucketSize: number; // Max size of each bucket
	private buckets: Bucket[]; // List of buckets

	constructor(N = 2, bucketSize = 4) {
		this.level = 0;
		this.next = 0;
		this.N = N;
		this.bucketSize = bucketSize;
		this.buckets = Array(N)
			.fill(null)
			.map((): Bucket => []);
	}

	private hash(key: number, level: number) {
		return key % (Math.pow(2, level) * this.N);
	}

	search() {}

	insert(key: number) {
		// Step 1: Determine the correct bucket index
		let i = this.hash(key, this.level);
		if (i < this.next) {
			// Use the next level's hash if the bucket has already been split
			i = this.hash(key, this.level + 1);
		}

		// Step 2: Insert the key into the determined bucket
		this.buckets[i].push(key);

		// Step 3: Check if the bucket overflows, triggering a split
		if (this.buckets[i].length > this.bucketSize) {
			this.split();
		}
	}

	private split() {
		// Step 1: Create a new bucket for the split
		this.buckets.push([]);

		// Step 2: Redistribute keys from the bucket being split
		const origin = this.next; // The bucket being split
		const newLevel = this.level + 1;

		const oldKeys = this.buckets[origin];
		this.buckets[origin] = []; // Clear the original bucket

		for (const key of oldKeys) {
			const i = this.hash(key, newLevel);
			this.buckets[i].push(key);
		}

		// Step 3: Update the `next` pointer
		this.next++;

		// Step 4: Check if we've completed all splits for the current level
		if (this.next >= Math.pow(2, this.level) * this.N) {
			this.level++; // Move to the next level
			this.next = 0; // Reset the next pointer
		}
	}

	delete() {}

	getBuckets(): Bucket[] {
		return this.buckets;
	}
}

const hashTable = new LinearHashtable(2, 4);
hashTable.insert(1);
hashTable.insert(5);
hashTable.insert(9);
hashTable.insert(13); // Should trigger a split
hashTable.insert(17); // Continue inserting
hashTable.insert(19); // Should trigger another split

console.log(hashTable.getBuckets())