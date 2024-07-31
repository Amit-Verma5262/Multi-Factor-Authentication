import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import OtpVerification from './components/OtpVerification';

function App() {
    const [showOtpVerification, setShowOtpVerification] = useState(false);

    return (
        <div className="App">
            <div style={centerStyle}>
                <h1>MFA using MERN Stack</h1>
            </div>
            {!showOtpVerification ? (
                <>
                    <Register />
                    <Login setShowOtpVerification={setShowOtpVerification} />
                </>
            ) : (
                <OtpVerification />
            )}
        </div>
    );
}

const centerStyle = {
    textAlign: 'center',
};

export default App;
