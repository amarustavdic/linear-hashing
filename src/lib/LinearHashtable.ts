


class LinearHashtable {

	private level: number;				// Current round number
	private next: number;					// Next bucket to split
	private N: number;						// Number of buckets
	private bucketSize: number;

	constructor(N = 2, bucketSize = 4) {
		this.level = 0;
		this.next = 0;
		this.N = N;
		this.bucketSize = bucketSize;
	}

	private hash(key: number) {
		return key % (Math.pow(2, this.level) * this.N);
	}

}