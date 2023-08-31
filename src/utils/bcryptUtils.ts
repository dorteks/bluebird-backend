const bcrypt = require("bcrypt");

export const generateHash = async (value: string) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(value, salt);
  return hash;
};

export const compareHash = async (value: string, hash: string) => {
  const compare = await bcrypt.compareSync(value, hash);
  return compare;
};
