/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    const cloneObj = {};
    Object.keys(obj).forEach(element => {
        if ( !fields.includes(element) ){
            cloneObj[element] = element;
        }
    });
    return cloneObj;
};
