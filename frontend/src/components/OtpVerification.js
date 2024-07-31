import React, { useState } from 'react';
import axios from 'axios';
import './styles/Login.css';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');

    const handleOtpVerification = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/verify-otp', { otp });

            if (response.data.success) {
                alert('OTP Verified. User logged in.');
                // Redirect to your dashboard or perform any additional actions for successful login
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error.message);
            alert('An error occurred during OTP verification');
        }
    };

    return (
        <div className="auth-container">
            <input
                type="text"
                placeholder="OTP"
                onChange={(e) => setOtp(e.target.value)}
            />
            <button className="auth-button" onClick={handleOtpVerification}>
                Verify OTP
            </button>
        </div>
    );
};

export default OtpVerification;
