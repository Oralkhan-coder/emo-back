const authService = require('../services/auth.service');
const logger = require('../utils/log');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email, password, and name'
        });
      }

      const result = await authService.register({ email, password, name, role });

      res.status(201).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error(`Register controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const result = await authService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        user: result.user
      });
    } catch (error) {
      logger.error(`Login controller error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      const result = await authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error(`Verify email controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error(`Refresh token controller error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.userId);

      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error(`Logout controller error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const result = await authService.resendVerificationEmail(email);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error(`Resend verification controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.userId).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      logger.error(`Get current user error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to get user information'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const result = await authService.updateProfile(userId, req.body);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error(`Update profile controller error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();