const User = require('../models/user');
const BigPromise = require('../middlewares/bigpromise');
const CustomError = require('../utils/customerror');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").replace('Bearer ', '');
    if (!token) {
        return next(new CustomError("Login first to access this page", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id);
    next();
});

exports.customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomError("You are not authorized to be here", 403));
        }
        next();
    }
}