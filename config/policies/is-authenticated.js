const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  const req = ctx.request;
  const token = req.body.token || req.query.token || req.headers["access-token"];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '86aa243c-f8ab-4e0b-97b2-ca589c89149e');
      req.user = decoded;
      return await next();
    } catch (err) {
      ctx.unauthorized(`Invalid Token`);
    }
  }
  ctx.unauthorized(`You're not logged in!`);
};