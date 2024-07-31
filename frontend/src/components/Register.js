import React, { useState } from 'react';
import axios from 'axios';
import './styles/Login.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/register', {
                email,
                password
            });

            if (response.data.success) {
                alert('User registered successfully');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert('An error occurred during registration');
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
            <button className="auth-button" onClick={handleRegister}>
                Register
            </button>
        </div>
    );
};

export default Register;
