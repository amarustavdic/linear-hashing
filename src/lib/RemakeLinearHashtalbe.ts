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