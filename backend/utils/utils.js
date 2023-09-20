const jwt = require('jsonwebtoken');

const generateAuthToken = (data) => {
  const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
  return token;
};

module.exports = { generateAuthToken };
