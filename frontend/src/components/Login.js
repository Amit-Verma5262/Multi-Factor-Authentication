import React, { useState } from 'react';
import axios from 'axios';
import './styles/Login.css';

const Login = ({ setShowOtpVerification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                setShowOtpVerification(true);
                alert('OTP sent to your email. Check your inbox.');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            alert('An error occurred during login');
        }
    };

    return (
        <div className="auth-container">
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="auth-button" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

export default Login;
