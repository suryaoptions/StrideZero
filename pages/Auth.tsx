
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import { User } from '../types';
import { AlertCircle, Loader } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      if (isLogin) {
        user = await login(formData.email, formData.password);
      } else {
        user = await register(formData.name, formData.email, formData.password);
      }
      
      onLogin(user);
      navigate('/catalog'); // Redirect to catalog after login
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tighter italic uppercase mb-2">
            Stride<span className="text-gray-400">Zero</span>
          </h2>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
            {isLogin ? 'Sign In' : 'Join The Club'}
          </h2>
          <p className="mt-4 text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-bold text-black underline hover:text-gray-600 transition-colors">
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" /> {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" 
                  placeholder="FULL NAME" 
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" 
                placeholder="EMAIL ADDRESS" 
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm" 
                placeholder="PASSWORD" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-gray-500 hover:text-black">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70"
            >
              {isLoading ? <Loader className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
          
          <div className="mt-4 text-xs text-center text-gray-400 bg-gray-50 p-2 rounded">
             <p><strong>Demo Mode:</strong></p>
             <p>Admin: admin@stridezero.com</p>
             <p>User: user@example.com</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
