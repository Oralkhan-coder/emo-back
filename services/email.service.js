const nodemailer = require('nodemailer');
const logger = require('../utils/log');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: true
      }
    });

  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `https://emo-back-xtg8.onrender.com/api/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to: ${email}`);
    } catch (error) {
      logger.error(`Error sending verification email to ${email}: ${error.message}`);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #dc3545; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to: ${email}`);
    } catch (error) {
      logger.error(`Error sending password reset email to ${email}: ${error.message}`);
      throw new Error('Failed to send password reset email');
    }
  }
}

module.exports = new EmailService();