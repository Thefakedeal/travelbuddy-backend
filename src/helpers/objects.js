const slice = (object = new Object(), keys = new Array()) => {
  const requiredKeys = Object.keys(object).filter((key) => keys.includes(key));
  const newObject = new Object();
  requiredKeys.forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
};

const remove = (object = new Object(), keys = new Array()) => {
  const requiredKeys = Object.keys(object).filter((key) => !keys.includes(key));
  const newObject = new Object();
  requiredKeys.forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
};

module.exports = {
  slice, remove
};
