const bcrypt = require('bcryptjs');

const hashPassword = async (plainText, saltRounds = 10) => {
  return await bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText, hashedPassword) => {
  return await bcrypt.compare(plainText, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
