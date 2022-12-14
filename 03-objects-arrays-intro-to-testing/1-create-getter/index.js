/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const pathData = path.split('.');
    let getter = (obj) => {
        pathData.forEach(element => {
            if (obj) {
                obj = obj[element];
            } else {
                return undefined;
            };
        });
        return obj
    };
    return getter
};
