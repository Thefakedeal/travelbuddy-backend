const Token = require('./model/Token');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

const userAuthHandler = async (req, res, next) => {
  if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) return res.status(401).json({ message: 'No Token Detected' });
  const tokenID = req.headers.authorization.split(' ')[1];

  try {
    req.token = tokenID;
    const token = await Token.findOne({ token: tokenID }).populate('user', '-password');
    if (!token || !token.user) return res.status(401).json({ message: 'Unauthenticated' });
    req.user = token.user;

    return next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

const adminAuthHandler = async (req, res, next) => {
  if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')) return res.status(401).json({ message: 'No Token Detected' });
  const tokenID = req.headers.authorization.split(' ')[1];

  try {
    req.token = tokenID;
    const token = await Token.findOne({ token: tokenID }).populate('user', '-password');
    if (!token || !token.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (!token.user.is_admin) return res.status(403).json({ message: 'Unauthorized' });

    req.user = token.user;

    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
};

module.exports = {
  notFound,
  errorHandler,
  userAuthHandler,
  adminAuthHandler,
};
