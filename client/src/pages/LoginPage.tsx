import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Input } from '../components/common/Input.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    navigate('/dashboard');
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400">
            Sign in to continue your career acceleration roadmap.
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
              label="Email Address"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#A78BFA] hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full glow-btn mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-[#1E293B] w-full" />
            <span className="bg-[#11182B] px-3 text-xs text-slate-500 uppercase font-semibold">
              Or Explore Instantly
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full border-[#7C5CFC]/30 text-slate-200 hover:text-white"
            onClick={handleDemoSignIn}
          >
            One-Click Demo Sign In (Alex Chen)
          </Button>

          <p className="text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-[#A78BFA] hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
