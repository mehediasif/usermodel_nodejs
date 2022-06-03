const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide a name'],
        maxlength: [40, 'Name Should be under 40 Characters']
    },
    email: {
        type: String,
        required: [true, 'Please Provide an email'],
        validate: [validate.isEmail, 'Please enter Correct email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Provide a Password'],
        minlength: [6, 'password should be longer'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },

});

//Encrypt Password before Saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})
//validate the password by user provided password
userSchema.methods.isvalidatePassword = async function (usersendPassword) {
    return await bcrypt.compare(usersendPassword, this.password)
};

//create and return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};
//generate forgot password token(string)
userSchema.methods.getForgotPasswordToken = function () {
    //generate a long string value
    const forgotToken = crypto.randomBytes(20).toString('hex');
    //getting a hash - making sure to get a hash on backend
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    //time of expiry
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    return forgotToken;
};

module.exports = mongoose.model('user', userSchema);