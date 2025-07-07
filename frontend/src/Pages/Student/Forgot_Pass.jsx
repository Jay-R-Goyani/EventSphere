import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';
import { OtpInput } from './Otp';

export const Forgot_Pass_Stu = () => {
  const [user, setUser] = useState({ email: '', password: '', cpassword: '' });
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError(null);
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/student-forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await response.json();
      if (response.ok && data.status === 'PENDING') {
        toast.success('OTP sent to your email');
        setStep(2);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (otpValue) => {
    setLoading(true);
    setOtpError(null);
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/student-forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, otp: otpValue })
      });
      const data = await response.json();
      if (response.ok && data.status === 'VERIFIED') {
        toast.success('OTP verified!');
        setOtpVerified(true);
        setStep(3);
      } else if (data.redirect) {
        toast.error(data.message || 'Invalid OTP. Redirecting to login...');
        setTimeout(() => navigate('/student-login'), 2000);
      } else {
        setOtpError(data.message || 'Invalid OTP');
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError('Network error');
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.cpassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/student-forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, newPassword: user.password })
      });
      const data = await response.json();
      if (response.ok && data.status === 'SUCCESS') {
        toast.success('Password reset successful!');
        setTimeout(() => navigate('/student-login'), 2000);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const PasswordCriteria = ({ password }) => {
    const criteria = [
      { label: 'At least 8 characters', regex: /.{8,}/ },
      { label: 'At most 30 characters', regex: /^.{0,30}$/ },
      { label: 'A number', regex: /\d/ },
      { label: 'A lowercase letter', regex: /[a-z]/ },
      { label: 'An uppercase letter', regex: /[A-Z]/ },
      { label: 'A special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
    ];
    return (
      <div className="text-sm text-gray-400 mb-2">
        <p className="font-semibold text-gray-400">Password must contain:</p>
        <ul className="list-disc list-inside">
          {criteria.map((criterion, index) => (
            <li key={index} className={criterion.regex.test(password) ? 'text-green-500' : 'text-white-900'}>
              {criterion.label}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer/>
      <div className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-400">Email Address *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="text"
                name="email"
                placeholder="Enter Your Email"
                value={user.email}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex justify-center">
              <button className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600 transition-colors" type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <OtpInput
            onSubmit={handleOtpSubmit}
            loading={loading}
            error={otpError}
            label="Verify OTP"
            onBack={() => setStep(1)}
            codeLength={4}
          />
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <PasswordCriteria password={user.password} />
              <label className="text-sm font-semibold text-gray-400">Enter New Password *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="password"
                name="password"
                placeholder="Your New Password"
                value={user.password}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">Confirm Password *</label>
              <input
                className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                type="password"
                name="cpassword"
                placeholder="Confirm Your New Password"
                value={user.cpassword}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex justify-center">
              <button className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600 transition-colors" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};