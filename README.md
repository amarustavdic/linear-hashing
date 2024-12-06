# Linear Hash Index

The **LinearHashIndex** is a dynamic hash table implementation designed to grow incrementally as keys are inserted. This
implementation supports initialization from JSON, making it easy to load a preconfigured state or serialized data.

---

## **How to Initialize the Index**

The `LinearHashIndex` can be initialized using JSON data. This allows you to start with a
specific configuration.

### **Initialization JSON Structure**

The JSON object must have the following structure:

- **`buckets`**: An array of buckets, where each bucket contains:
    - **`keys`**: An array of numbers representing the keys stored in that bucket.
- **`next`**: A number representing the next bucket to be split.
- **`level`**: The current level of the hash table.
- **`N`**: The initial number of buckets (must be a power of 2).
- **`maxBucketSize`**: The maximum number of keys a bucket can hold before splitting or using overflow.

---

### **Example JSON for Initialization**

#### Example 1:

```json
{
  "buckets": [
    { "keys": [ 10, 20, 30 ] },
    { "keys": [ 40, 50 ] },
    { "keys": [] },
    { "keys": [ 60 ] }
  ],
  "next": 1,
  "level": 2,
  "N": 4,
  "maxBucketSize": 4
}
```

#### Example 2:

```json
{
  "buckets": [
    { "keys": [ 8, 40, 64, 96] },
    { "keys": [ 9, 17 ] },
    { "keys": [ 2, 46, 10 ] },
    { "keys": [ 7, 11, 23, 39 ] },
    { "keys": [ 60, 4 ] },
    { "keys": [ 29, 14, 5 ] }
  ],
  "next": 2,
  "level": 1,
  "N": 4,
  "maxBucketSize": 4
}
```

---

### **Key Features**

- **Dynamic Splitting**: Automatically redistributes keys when a bucket overflows.
- **Initialization from JSON**: Easily restore a hash table from saved data.
- **Custom Bucket Configuration**: Control the size and structure of buckets with `maxBucketSize` and `N`.
