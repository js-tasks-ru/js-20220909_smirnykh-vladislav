/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (!size) {
        return string;
    }
    if (size === 0){
        return '';
    }
    let result = '';
    let count = 0;

    string.split('').forEach(symbol => {
        if (result.at(-1) === symbol){
            if (size !== count){
                count++;
                result += symbol;
            };
        } else {
            count = 1;
            result += symbol;
        };
    });
    return result
};
