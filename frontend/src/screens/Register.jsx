import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/user.context'; // Assuming UserContext is defined

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/users/register', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user); // Assuming data.user contains user info
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            alert('Registration failed. Please try again.'); // User-friendly error
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg animate-pulse">
                    Join Our Codeverse!
                </h2>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-purple-200 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border border-purple-500 focus:ring-4 focus:ring-purple-400 focus:border-transparent outline-none transition duration-300"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium text-purple-200 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 border border-purple-500 focus:ring-4 focus:ring-purple-400 focus:border-transparent outline-none transition duration-300"
                            placeholder="Strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-300 text-md mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition duration-300">
                        Login here!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;