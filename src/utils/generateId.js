module.exports.generateId = (digits) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = digits; i > 0; i--) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};
