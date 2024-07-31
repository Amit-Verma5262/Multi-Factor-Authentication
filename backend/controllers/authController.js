const bcrypt = require('bcrypt');
const randomize = require('randomatic');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const saltRounds = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function sendOtpEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({
            email,
            password: hashedPassword,
        });
        await user.save();

        return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        return res.status(500).json({ success: false, message: 'An error occurred during registration' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const generatedOtp = randomize('0', 6);
        user.otp = generatedOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        sendOtpEmail(email, generatedOtp);

        return res.json({ success: true });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.json({ success: false, message: 'Invalid OTP or OTP expired' });
        }

        user.otp = '';
        user.otpExpires = null;
        await user.save();

        return res.json({ success: true });
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        return res.status(500).json({ success: false, message: 'An error occurred during OTP verification' });
    }
};
