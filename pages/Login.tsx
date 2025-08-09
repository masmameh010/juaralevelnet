import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LOGO_URL } from '../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will happen automatically in App.tsx after state update
    } catch (err: any) {
      setError(err.message || 'Gagal untuk login.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Levelnet Logo" className="mx-auto h-16 w-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Sales Reporting Portal</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="contoh@levelnet.com"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;