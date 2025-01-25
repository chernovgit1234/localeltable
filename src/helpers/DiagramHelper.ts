export function findMedian(arr: any[]) {
    const sortedArray = arr.sort((a, b) => a - b)
    let median
    // Определяем медиану в зависимости от четности длины массива
    if (sortedArray.length % 2 !== 0) { // Нечетная длина
        median = sortedArray[Math.floor(sortedArray.length / 2)];
    } else { // Четная длина
        const mid1 = sortedArray[(sortedArray.length / 2) - 1];
        const mid2 = sortedArray[sortedArray.length / 2];
        median = (mid1 + mid2) / 2;
    }

    return median;
}