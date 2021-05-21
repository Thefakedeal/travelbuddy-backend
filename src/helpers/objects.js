const slice = (object={}, keys=[]) =>{
    const requiredKeys= Object.keys(object).filter(key=> keys.includes(key))
    const newObject = {};
    requiredKeys.forEach(key => {
        newObject[key] = object[key];
    });
   return newObject;
}

const remove = (object={}, keys=[]) =>{
    const requiredKeys= Object.keys(object).filter(key=> !keys.includes(key))
    const newObject = {};
    requiredKeys.forEach(key => {
        newObject[key] = object[key];
    });
   return newObject;
}


module.exports = {
    slice, remove
}