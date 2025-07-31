import React , {useState , useContext} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();
        axios.post('/users/login', {
            email, 
            password 
            }
        ).then((res) => {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        }).catch((err) => {
            console.error('Login failed:', err);
        });
}

return (
    <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{
            background: "linear-gradient(135deg, #3a8dde 0%, #6dd5ed 50%, #f7797d 100%)"
        }}
    >
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h2>

            <form className="space-y-5" onSubmit={submitHandler}> 
                <div>
                    <label className="block text-sm font-medium text-blue-900">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-900">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="********"
                        className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                >
                    Login
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-blue-700">
                Don’t have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:underline font-semibold">
                    Create one
                </Link>
            </p>
        </div>
    </div>
);
};

export default Login;
