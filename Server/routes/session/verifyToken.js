const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      return res.status(401).json('you need to login')
    }
    const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = {
      email: decrypt.email,
      id:decrypt.id
    };
    next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};

module.exports = verifyToken;