module.exports = async (fn, ...params) => {
  let res = null;
  let err = null;
  try {
    res = await fn(params);
  } catch (e) {
    err = e;
  }
  return [err, res];
};
