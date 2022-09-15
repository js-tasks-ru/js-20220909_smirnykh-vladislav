/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
    const arrCopy = [...arr];
    const caseFirst = param === 'desc' ? 'lower': 'upper';
    let collator = new Intl.Collator('ru', {caseFirst: caseFirst});
    let result = arrCopy.sort((a, b) => {
        return param === 'desc' ? collator.compare(b, a): collator.compare(a, b);
      });
    return result
}
