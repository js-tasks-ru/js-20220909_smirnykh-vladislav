/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const cloneObj = {};
    fields.forEach(element => {
        if ( Object.keys(obj).includes(element) ){
            cloneObj[element] = element;
        }
    });
    return cloneObj;
};
