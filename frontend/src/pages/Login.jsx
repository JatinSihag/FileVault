import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserProvider'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/user/login`,
                { username, password }
            );
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            console.log('User after login:', res.data.user);
            navigate('/home');
        } catch (err) {
            console.log(err);
            alert("Login failed. Please check your credentials.");
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className="p-[2px] rounded-md bg-gradient-to-r from-blue-500 to-pink-500">
                <form onSubmit={handleLogin} className='w-120 p-7 rounded-md bg-gray-900 flex flex-col gap-5'>
                    <h2 className='text-white text-5xl mb-4 text-center'>Login</h2>
                    <input
                        type="text"
                        placeholder='Enter your Username'
                        onChange={e => setUsername(e.target.value)}
                        required
                        className='h-13 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="password"
                        placeholder='Enter your password'
                        onChange={e => setPassword(e.target.value)}
                        required
                        className='h-13 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button type='submit' className='h-13 bg-blue-600 hover:bg-blue-700 text-white text-2xl py-2 rounded font-semibold'>
                        Login
                    </button>
                    <p className='text-gray-400 text-sm text-center'>
                        Don't have an account?{' '}
                        <Link to="/register" className='text-blue-400 hover:underline'>Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;
