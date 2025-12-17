// const jwt = require('jsonwebtoken');

// module.exports = async function (req, res, next) {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
