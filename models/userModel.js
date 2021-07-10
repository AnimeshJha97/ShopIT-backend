const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        trim: true,
        maxLength: [30, 'Length cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter a email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [5, 'Password should be greater than 5 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// If password not modified, don't encrypt, else encrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// Match Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(this.password, enteredPassword)
}

// Return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Reset Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000)
    console.log(this.resetPasswordExpire)
    console.log('token reset', resetToken, this.resetPasswordToken)

    // returns non-hashed token so that it can be compared later after hashing with the current hashed resetToken
    return resetToken
}

module.exports = mongoose.model('User', userSchema);