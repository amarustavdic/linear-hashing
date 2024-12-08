import { describe, it, expect, beforeEach } from 'vitest';
import { LinearHashingIndex } from '$lib/LinearHashingIndex';

describe('LinearHashingIndex', () => {
	let index: LinearHashingIndex;

	beforeEach(() => {
		index = new LinearHashingIndex({
			N: 4,
			maxBucketSize: 4,
			triggerType: 'overflow'
		});
	});

	it('should initialize with correct defaults', () => {
		const defaultIndex = new LinearHashingIndex();
		expect(defaultIndex).toBeDefined();
		expect(defaultIndex['level']).toBe(0);
		expect(defaultIndex['next']).toBe(0);
		expect(defaultIndex['buckets'].size).toBe(2); // Default N = 2
	});

	it('should insert keys into the correct buckets', () => {
		index.insert(1);
		index.insert(5); // Same bucket as 1 with default hash
		index.insert(10);

		expect(index['buckets'].get(1)).toEqual([1, 5]);
		expect(index['buckets'].get(2)).toEqual([10]);
	});

	it('should split buckets when overflow trigger is reached', () => {
		index.insert(1);
		index.insert(5);
		index.insert(9);
		index.insert(13); // Should trigger a split
		index.insert(17);

		expect(index['buckets'].size).toBeGreaterThan(4); // Splits should add a new bucket
	});

	it('should delete keys and update totalEntries', () => {
		index.insert(1);
		index.insert(2);
		expect(index['totalEntries']).toBe(2);

		const result = index.delete(1);
		expect(result).toBe(true);
		expect(index['totalEntries']).toBe(1);
		expect(index['buckets'].get(1)!.includes(1)).toBe(false);

		const failResult = index.delete(42);
		expect(failResult).toBe(false); // Key does not exist
	});

	it('should handle searches correctly', () => {
		index.insert(1);
		index.insert(2);

		expect(index.search(1)).toBe(true);
		expect(index.search(2)).toBe(true);
		expect(index.search(3)).toBe(false); // Non-existent key
	});

	it('should respect capacityThreshold trigger type', () => {
		const indexCapacity = new LinearHashingIndex({
			N: 2,
			maxBucketSize: 2,
			capacityThreshold: 0.5,
			triggerType: 'capacityThreshold'
		});

		indexCapacity.insert(1);
		indexCapacity.insert(2);
		indexCapacity.insert(3); // Should trigger split due to capacity threshold

		expect(indexCapacity['buckets'].size).toBeGreaterThan(2);
	});

	it('should not allow splits if maxBucketSize not exceeded for overflow', () => {
		index.insert(1);
		index.insert(2);
		index.insert(3);

		expect(index['buckets'].size).toBe(4); // Initial buckets = 4
		expect(index['level']).toBe(0); // No split yet
	});

	it('should handle collisions correctly', () => {
		index.insert(1);
		index.insert(5); // Both should go to the same bucket

		const bucket = index['buckets'].get(1)!;
		expect(bucket).toContain(1);
		expect(bucket).toContain(5);
	});
});
