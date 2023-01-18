const boom = require('@hapi/boom');
const debug = require("debug")("app:auth");

const { config } = require('./../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkRoles(...roles) { //los tres puntos envían todo como array []
  return (req, res, next) => { 
    const user = req.user;
    if (roles.includes(user.rol)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
}

module.exports = { checkApiKey, checkRoles };
