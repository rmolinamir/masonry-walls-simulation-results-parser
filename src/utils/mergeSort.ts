/**
 * Default element adapter for the binary search. Simply casts values
 * to numbers to make mathematical comparisons.
 * @param element - Element that will be casted to a number.
 */
function defaultElementAdapter(element: unknown): number {
  return Number(element);
}

/**
 * Responsible for merging two sorted arrays **in the same way**. Given two
 * arrays which are sorted, this helper function should create a new array
 * which is also sorted, and consists of all of the elements in the two
 * input arrays.
 * @param {T[]} arr1 - Array of elements of type T.
 * @param {T[]} arr2 - Array of elements of type T.
 * @param {Function} elementAdapter - Adapter for mathematical comparisons of elements of type T.
 */
function merge<T = unknown>(
  arr1: T[] = [],
  arr2: T[] = [],
  elementAdapter: (element: T) => number = defaultElementAdapter,
): T[] {
  const arr = [];
  let i = 0; // arr1 loop counter.
  let j = 0; // arr2 loop counter.
  while (i < arr1.length && j < arr2.length) {
    if (elementAdapter(arr1[i]) < elementAdapter(arr2[j])) {
      arr.push(arr1[i]);
      i += 1;
    } else {
      arr.push(arr2[j]);
      j += 1;
    }
  }
  if (i === arr1.length) {
    for (j; j < arr2.length; j += 1) {
      arr.push(arr2[j]);
    }
  } else {
    for (i; i < arr1.length; i += 1) {
      arr.push(arr1[i]);
    }
  }
  return arr;
}

/**
 * Decomposing an array into smaller arrays of 0 or 1 elements
 * (divide and conquer approach), then building up a newly
 * sorted array.
 * @param {T[]} arr - Unsorted array of elements of type T.
 */
export function mergeSort<T = unknown>(
  arr: T[],
  elementAdapter: (element: T) => number = defaultElementAdapter,
): T[] {
  if (arr.length <= 1) return arr;
  const half = Math.floor(arr.length / 2);
  return merge(
    mergeSort(arr.slice(0, half), elementAdapter),
    mergeSort(arr.slice(half), elementAdapter),
    elementAdapter,
  );
}
