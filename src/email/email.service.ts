import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASSWORD || 'password',
      },
    });
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Warehouse Configurator" <noreply@warehouse.com>',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
      html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendActivationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Warehouse Configurator" <noreply@warehouse.com>',
      to: email,
      subject: 'Account Activation Code',
      text: `Your account activation code is: ${code}`,
      html: `<p>Your account activation code is: <strong>${code}</strong></p><p>Please use this code to activate your account.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}