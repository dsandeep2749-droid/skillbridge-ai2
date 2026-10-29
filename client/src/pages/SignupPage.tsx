import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Input } from '../components/common/Input.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getSignupErrorMessage = (err: any) => {
    const message = String(err?.message || '').toLowerCase();

    if (message.includes('email rate limit exceeded')) {
      return 'Too many signup emails were sent recently. Please wait a few minutes and try again, or use a different email address.';
    }

    if (message.includes('user already registered') || message.includes('already exists')) {
      return 'An account with this email already exists. Please sign in instead.';
    }

    return err?.message || 'Registration failed. Please check your details and try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoading) return;

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      await signup(email, password, fullName);
      navigate('/onboarding');
    } catch (err: any) {
      setError(getSignupErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#7C5CFC] p-0.5 shadow-md shadow-[#7C5CFC]/20">
              <div className="w-full h-full bg-[#11182B] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#38BDF8]" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              SkillBridge<span className="gradient-text font-extrabold">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="text-sm text-slate-400">
            Start benchmarking your skills and building your AI roadmap.
          </p>
        </div>

        <Card className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Maya Patel"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="maya.patel@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              helperText="Use a secure password with a combination of letters and numbers."
              required
            />

            <Button
              type="submit"
              className="w-full glow-btn mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Onboarding
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-[#A78BFA] hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
