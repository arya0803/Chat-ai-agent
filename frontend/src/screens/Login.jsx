import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js'; // Assuming this is your configured axios instance
import { UserContext } from '../context/user.context';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    function submitHandler(e) {
        e.preventDefault();
        setLoginError(''); // Clear any previous errors

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        }).catch((err) => {
            console.log(err.response.data);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setLoginError(errorMessage);
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-green-900 p-4 font-sans">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                .custom-placeholder::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                `}
            </style>
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-4xl font-extrabold text-cyan-400 mb-8 text-center drop-shadow-lg animate-pulse">
                    Welcome Back!
                </h2>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-blue-200 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-white custom-placeholder border border-blue-500 focus:ring-4 focus:ring-blue-400 focus:border-transparent outline-none transition duration-300"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium text-blue-200 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-white custom-placeholder border border-blue-500 focus:ring-4 focus:ring-blue-400 focus:border-transparent outline-none transition duration-300"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {loginError && (
                        <div className="text-center text-red-300 font-semibold text-sm animate-fade-in">
                            {loginError}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-300 text-md mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold transition duration-300">
                        Register now!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
