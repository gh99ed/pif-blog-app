const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username must not exceed 20 characters'],
      validate: {
        validator: function (v) {
          return /^(?!.*[_.]{2})[a-zA-Z0-9._]+$/.test(v) &&
                 /^(?![_.])[a-zA-Z0-9._]+(?<![_.])$/.test(v);
        },
        message: 'Username must only contain letters, numbers, dots, or underscores, and not start or end with them.',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    password: {
      type: String,
      required: function () {
        return this.provider !== 'google';
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    avatar: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
