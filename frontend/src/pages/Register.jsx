import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/user/register`,
                { username, email, password }
            );
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                console.error("Unknown error", err);
                alert("Something went wrong during registration.");
            }
        }
    };

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className="p-[2px] rounded-md bg-gradient-to-r from-blue-500 to-pink-500">
                <form onSubmit={handleRegister} className='w-120 p-6 bg-gray-900 rounded-md shadow-md flex flex-col gap-4'>
                    <h2 className='text-white text-5xl mb-4 text-center'>Register</h2>
                    <input
                        type="text"
                        placeholder='Enter Your Username'
                        onChange={e => setUsername(e.target.value)}
                        required
                        className='h-13 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="email"
                        placeholder='Enter Your Email'
                        onChange={e => setEmail(e.target.value)}
                        required
                        className='h-13 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type="password"
                        placeholder='Enter Your Password'
                        onChange={e => setPassword(e.target.value)}
                        required
                        className='h-13 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        type='submit'
                        className='h-13 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold'
                    >
                        Register
                    </button>
                    <p className='text-gray-400 text-sm text-center'>
                        Already have an account?{' '}
                        <Link to="/login" className='text-blue-400 hover:underline'>LogIn</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
