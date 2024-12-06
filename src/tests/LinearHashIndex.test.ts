import { describe, it, expect } from 'vitest';
import { LinearHashIndex } from '$lib/LinearHashtableIndex';

describe('LinearHashIndex', () => {
	it('should initialize with default values', () => {
		const hashtable = new LinearHashIndex({});
		expect(hashtable.getBuckets().length).toBe(2);
		expect(hashtable.getLevel()).toBe(0);
		expect(hashtable.getNext()).toBe(0);
	});

	it('should initialize with provided data', () => {
		const data = {
			buckets: [{ keys: [10, 20] }, { keys: [30] }],
			next: 1,
			level: 2,
			N: 4,
			maxBucketSize: 4
		};
		const hashtable = new LinearHashIndex(data);

		expect(hashtable.getBuckets()).toEqual([[10, 20], [30]]);
		expect(hashtable.getNext()).toBe(1);
		expect(hashtable.getLevel()).toBe(2);
	});

	it('should search for keys', () => {
		const hashtable = new LinearHashIndex({ N: 2, maxBucketSize: 4 });
		hashtable.insert(10);
		hashtable.insert(20);

		expect(hashtable.search(10)).toBe(true);
		expect(hashtable.search(99)).toBe(false);
	});

	it('should handle splitting correctly', () => {
		const hashtable = new LinearHashIndex({ N: 2, maxBucketSize: 2 });
		hashtable.insert(10);
		hashtable.insert(20);
		hashtable.insert(30);
		hashtable.insert(40);

		const buckets = hashtable.getBuckets();
		expect(buckets.length).toBeGreaterThan(2); // Splitting occurred
	});

	it('should initialize from JSON', () => {
		const json = `{
            "buckets": [{ "keys": [10, 20] }, { "keys": [30] }],
            "next": 1,
            "level": 2,
            "N": 4,
            "maxBucketSize": 4
        }`;
		const data = JSON.parse(json);
		const hashtable = new LinearHashIndex(data);

		expect(hashtable.getBuckets()).toEqual([[10, 20], [30]]);
		expect(hashtable.getNext()).toBe(1);
		expect(hashtable.getLevel()).toBe(2);
	});
});
