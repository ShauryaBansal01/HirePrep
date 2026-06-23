import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { login as loginService } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  // 1. OPEN THE VAULT
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // 2. CALL THE BACKEND
      const response = await loginService(email, password);
      
      // 3. STORE IN THE VAULT
      login(response.token, response.user);
      
      // 4. GO TO DASHBOARD
      navigate('/dashboard');
      
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Login in to your account to continue .</h1>
            <p className="text-gray-400 text-sm mt-2">Join HirePrep and start practicing today.</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
  
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                {error}
              </div>
            )}
  
            <Button type="submit" fullWidth className="mt-6">
              Log In
            </Button>
          </form>
        </Card>
      </div>
    );
  }
  // ... Build the return() block exactly like the Register page, 
  // but only with Email and Password inputs, and a "Login" button!
