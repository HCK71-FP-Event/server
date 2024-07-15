const bcrypt = require("bcryptjs");

const hashPassword = (pass) => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(8));
};

const comparePass = (pass, hashedPass) => {
  return bcrypt.compareSync(pass, hashedPass);
};

module.exports = {
  hashPassword,
  comparePass,
};
