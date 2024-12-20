const User = require('../models/User');
const AuthUtils = require('../utils/auth.utils');
const { REGISTRATION_TYPES } = require('../config/constants');
const logger = require('../utils/logger');

class AuthService {
  async register(userData) {
    const { password, ...otherData } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { mobileNumber: userData.mobileNumber }
      ]
    });

    if (existingUser) {
      throw new Error('User already exists with this email or mobile number');
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create new user
    const user = new User({
      ...otherData,
      password: hashedPassword
    });

    return await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user || user.status !== 'active') {
      throw new Error('Invalid credentials or account inactive');
    }

    const isPasswordValid = await AuthUtils.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = AuthUtils.generateToken({
      userId: user._id,
      registrationType: user.registrationType
    });

    return { user, token };
  }
}

module.exports = new AuthService();