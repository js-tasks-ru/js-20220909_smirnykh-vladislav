/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size=false) {
    if (size === 0){
        return '';
    }
    if (!size) {
        return string;
    }
    let result = '';
    let count = 0;

    string.split('').forEach(symbol => {
        if (result.at(-1) === symbol && size !== count){
            count++;
            result += symbol;
        } else if (result[result.length-1] !== symbol){
            count = 1;
            result += symbol;
        };
    });
    return result
};
