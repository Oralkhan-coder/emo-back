const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('./email.service');
const logger = require('../utils/log');

class AuthService {
  generateAccessToken(user) {
    return jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
  }

  async register(userData) {
    try {
      const { email, password, name, role } = userData;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = new User({ email, password, name, role });

      // Generate verification token
      const verificationToken = user.generateVerificationToken();
      await user.save();

      await emailService.sendVerificationEmail(email, verificationToken);

      logger.info(`New user registered: ${email}`);

      return {
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user._id
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password');

      if (user) {
        logger.info(`Login attempt for ${email}. User found. Hash length: ${user.password ? user.password.length : 'null'}`);
        const isMatch = await user.comparePassword(password);
        logger.info(`Password match result: ${isMatch}`);
      } else {
        logger.info(`Login attempt for ${email}. User NOT found.`);
      }

      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
      }

      if (!user.isEmailVerified) {
        throw new Error('Please verify your email before logging in');
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      logger.info(`User logged in: ${email}`);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      logger.info(`Email verified for user: ${user.email}`);

      return { message: 'Email verified successfully' };
    } catch (error) {
      logger.error(`Email verification error: ${error.message}`);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user);

      return { accessToken: newAccessToken };
    } catch (error) {
      logger.error(`Token refresh error: ${error.message}`);
      throw error;
    }
  }

  async logout(userId) {
    try {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
      logger.info(`User logged out: ${userId}`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      throw error;
    }
  }

  async resendVerificationEmail(email) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email is already verified');
      }

      const verificationToken = user.generateVerificationToken();
      await user.save();

      await emailService.sendVerificationEmail(email, verificationToken);

      logger.info(`Verification email resent to: ${email}`);

      return { message: 'Verification email sent' };
    } catch (error) {
      logger.error(`Resend verification error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();