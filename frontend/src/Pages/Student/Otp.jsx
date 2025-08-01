import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';


export const OtpInput = ({ onSubmit, loading, error, label = 'Verify email', onBack, codeLength = 4 }) => {
  const [code, setCode] = useState(Array(codeLength).fill(''));

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    if (value && index < code.length - 1) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(code.join(''));
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg w-96 text-center">
      <h2 className="text-2xl font-semibold mb-4">{label}</h2>
      <p className="mb-6">A verification code has been sent to you. Enter the code below</p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-2xl text-center rounded border border-gray-700 bg-gray-900 focus:outline-none focus:border-yellow-500"
            />
          ))}
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-yellow-500 text-gray-800 font-semibold rounded hover:bg-yellow-600 transition duration-200">
          {loading ? 'Verifying...' : label}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-4 text-sm flex justify-between">
          {onBack && <button type="button" className="text-gray-400 hover:underline" onClick={onBack}>← Back</button>}
        </div>
      </form>
    </div>
  );
};

export const Otp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { userId } = useParams();

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/verify-otp`, {
        method: "POST",
        headers: {"Content-Type" : "application/json",},
        body: JSON.stringify({userId, otp}),
      })
      const data = await response.json();
      console.log(data);
      if (data.status === "VERIFIED") {
        toast.success(data.message || "Email verified successfully!");
        setTimeout(() => {
          navigate('/student-login');
        }, 2000);
      } else {
        toast.error(data.message || "OTP verification failed");
        setTimeout(() => {
            navigate('/student-register');
        }, 2000);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <ToastContainer/>
      <OtpInput
        onSubmit={handleOtpSubmit}
        loading={false} // Placeholder for loading state
        error={error}
        label="Verify email"
        onBack={() => navigate('/student-login')}
        codeLength={4}
      />
    </div>
  );
};