
import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (role: 'CITIZEN' | 'RESPONDER') => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Logic for demo: if email contains 'admin' or 'responder', login as responder
      const role = email.toLowerCase().includes('admin') || email.toLowerCase().includes('responder') 
        ? 'RESPONDER' 
        : 'CITIZEN';
      onLogin(role);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden">
          <div className="p-8 text-center bg-blue-600 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield size={120} />
            </div>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Shield size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Anginat</h2>
            <p className="text-blue-100 text-sm">Incident Management System</p>
          </div>

          <div className="p-8">
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl text-sm transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl text-sm transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl text-sm transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot Password?</button>
                </div>
              )}

              <button 
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-500">Hackathon Note: Use 'admin@anginat.com' to log in as a Responder.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
