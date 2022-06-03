const User = require("../models/user")
const BigPromise = require("../middlewares/bigpromise")
const CustomError = require("../utils/customerror")
const cookieToken = require('../utils/cookieToken')
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const mailHelper = require("../utils/emailhelper");
const crypto = require('crypto')



exports.signup = BigPromise(async (req, res, next) => {

    const { name, email, password } = req.body

    if (!email || !name || !password) {
        return next(new CustomError("Please Provide Name,Email and password", 400));
    }
    let result;
    if (req.files) {
        let file = req.files.photo
        result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"

        })
    }


    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });

    cookieToken(user, res);
});
exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body
    //checking if email and password exist
    if (!email || !password) {
        return next(new CustomError("Please provide email and password", 400))
    }
    //getting user from Database
    const user = await User.findOne({ email }).select("+password");
    //if user not registered
    if (!user) {
        return next(new CustomError("You're not registered", 400))
    }
    //matching password
    const isPasswordCorrect = await user.isvalidatePassword(password);
    //is password incorrect
    if (!isPasswordCorrect) {
        return next(new CustomError("Incorrect Password!", 400))
    }
    //everything matches and we send the token
    cookieToken(user, res);

});
exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logout Success",
    })
});
exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return next(new CustomError("Email not registered yet!", 400))
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({ validateBeforeSave: false })

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    const message = `Copy paste this link in URL and enter the link \n \n ${myUrl}`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset Email",
            message: message,
        });

        res.status(200).json({
            success: true,
            message: "Email sent succesfully",
        })
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new CustomError(error.message, 500))
    }
});
exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token

    const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        encryptedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        return next(new CustomError("Token is invalid or expired"), 400)
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError("Password and Confirm password Doesn't match"), 400)
    }

    user.password = req.body.password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user: user,
    })
});
exports.changePassword = BigPromise(async (req, res, next) => {

    const userId = req.user.id;

    const user = await user.findById(userId).select("+password")

    const IsCorrectOldPassword = await user.isvalidatePassword(req.body.oldPassword)

    if (!IsCorrectOldPassword) {
        return next(new CustomError('old password is incorrect', 400))
    }
    user.password = req.body.password

    await user.save();

    cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.files) {
        const user = User.findById(req.user.id)

        const imageId = user.photo.id

        //delete old photo
        const response = await cloudinary.v2.uploader.destroy(imageId)

        //upload new photo
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users,
    });

});

exports.adminGetSingleUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        next(new CustomError("No users found by this", 400));
    }
    res.status(200).json({
        success: true,
        user
    });
});

exports.adminUpdateSingleUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

exports.adminDeleteSingleUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new CustomError("No such user found", 401))
    }

    const imageId = user.photo.id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove()

    res.status(200).json({
        success: true
    });
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find({ role: 'user' });

    res.status(200).json({
        success: true,
        users,
    });

});
