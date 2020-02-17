const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        salutation: {
            type: String,
            maxlength: 15
        },
        firstName: {
            type: String,
            maxlength: [100, 'First name must have less than 101 characters.']
        },
        lastName: {
            type: String,
            required: [
                true,
                'Last name is required. If only one name, please enter it here.'
            ],
            maxlength: [100, 'Last name must have less than 101 characters.']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail]
        },
        password: {
            type: String,
            required: [true, 'Please provide a password.'],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password.'],
            validate: {
                validator: function(el) {
                    return el === this.password;
                },
                message: 'Passwords are not the same.'
            },
            select: false
        },
        role: {
            type: String,
            enum: {
                values: [
                    'admin',
                    'practitioner',
                    'client',
                    'other',
                    'role not specified'
                ],
                message:
                    'Please choose one of the following: admin, practitioner, client, other.'
            },
            default: 'role not specified'
        },
        practionerType: {
            type: String
        },
        isApproved: Boolean,
        discountType: {
            type: String,
            enum: {
                values: ['none', 'standard', 'admin', 'other'],
                message:
                    'Please choose one of the following: none, standard, admin, other'
            },
            default: 'none'
        },
        hasKey: Boolean,
        notes: String,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.virtual('fullName').get(function() {
    const fullName = `${this.salutation ? this.salutation : ''} ${
        this.firstName ? this.firstName : ''
    } ${this.lastName ? this.lastName : ''}`;
    return fullName;
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = '';
    next();
});
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.pre(/^find/, function(next) {
    this.find({ isActive: !false });
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp + 10 > changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = async function(req, res, next) {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
