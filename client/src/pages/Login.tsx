
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

            <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
                        Hello Again!
                    </h2>
                    <p className="text-gray-500 mt-2">Welcome back to your nutrition assistant</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input placeholder="Email Address" type="email" />
                    <Input placeholder="Password" type="password" />

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center text-gray-500 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-teal-600 font-medium hover:underline">Forgot Password?</a>
                    </div>

                    <Button className="w-full" size="lg" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/auth/signup" className="text-teal-600 font-bold hover:underline">Sign Up</Link>
                </div>
            </Card>
        </div>
    );
};
