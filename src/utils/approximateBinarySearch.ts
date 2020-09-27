/**
 * Default element adapter for the binary search. Simply casts values
 * to numbers to make mathematical comparisons.
 * @param element - Element that will be casted to a number.
 */
function defaultElementAdapter(element: unknown): number {
  return Number(element);
}

/**
 * Accepts an array and a value and returns the index at which the value exists.
 * Otherwise, return the closest index to the target value.
 * @param {T[]} arr - Array of elements of type T.
 * @param {Number} targetValue - Target value to be found.
 * @param {Function} elementAdapter - Adapter for mathematical comparisons of elements of type T.
 */
export function approximateBinarySearch<T = number>(
  arr: T[],
  targetValue: number,
  elementAdapter: (element: T) => number = defaultElementAdapter,
): number {
  // - Create a left pointer at the start of the array, and a right pointer at the end of the array.
  let start = 0;
  let end = arr.length - 1;
  // - Create a pointer in the middle.
  let middle = Math.floor((start + end) / 2);
  // - While the left pointer comes before the right pointer.
  while(elementAdapter(arr[middle]) !== targetValue && start <= end) {
    // - If the value is too large, move the right pointer down closer to the left.
    console.log('targetValue: ', targetValue);
    console.log('middle: ', middle);
    console.log('elementAdapter(arr[middle]): ', elementAdapter(arr[middle]));
    if(targetValue < elementAdapter(arr[middle])){
      end = middle - 1;
    // - If the value is too small, move the left pointer up closer to the right.
    } else {
      start = middle + 1;
    }
    middle = Math.floor((start + end) / 2);
  }
  // - Return the index of the value or of the closest value.
  return middle;
}
