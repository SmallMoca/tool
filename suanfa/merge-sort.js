/**
 *
 * @param {number[]} arr
 */
function mergeSort(arr) {
  let arrLen = arr.length;
  if (arrLen <= 1) return arr;
  let mid = Math.floor(arrLen / 2);
  const lArr = mergeSort(arr.slice(0, mid));
  const rArr = mergeSort(arr.slice(mid, arrLen));

  return mergeArr(lArr, rArr);
}

/**
 *
 *
 * @param {number[]} lArr
 * @param {number[]} rArr
 */
function mergeArr(lArr, rArr) {
  let l = 0,
    r = 0;

  let lLen = lArr.length;
  let rLen = rArr.length;
  let res = [];
  while (l < lLen && r < rLen) {
    if (lArr[l] < rArr[r]) {
      res.push(lArr[l]);
      l++;
    } else {
      res.push(rArr[r]);
      r++;
    }
  }

  if (l < lLen) {
    //说明 lArr 还有剩余
    return res.concat(lArr.slice(l, lLen));
  } else {
    return res.concat(rArr.slice(r, rLen));
  }
}

console.log(mergeSort([10, 9, 7, 100, 0.1, 14, 1, 0, -2]));

// quickSort

/**
 *
 *
 * @param {number[]} arr
 * @param {number} i
 * @param {number} j
 */
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
