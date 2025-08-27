/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/millet-field-background.png'; // Save the new background image here

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => ({ ...preve, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            const response = await Axios({ ...SummaryApi.register, data });
            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const valideValue = Object.values(data).every(el => el);

    return (
        <section 
            className='min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-cover bg-center'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className='relative w-full max-w-md mx-auto'>
                
               

                {/* Register Card */}
                <div className='relative z-10 bg-white/80 backdrop-blur-md my-4 rounded-xl p-8 shadow-2xl'>
                    <h1 className='text-3xl font-bold text-center text-green-800'>Create an Account</h1>
                    <p className='text-center text-slate-600 mb-6'>Join the RealMillet family!</p>

                    <form className='grid gap-4' onSubmit={handleSubmit}>
                        {/* Form fields remain the same */}
                        <div className='grid gap-1'>
                            <label htmlFor='name'>Name:</label>
                            <input type='text' id='name' autoFocus className='bg-white/70 p-2 border border-slate-300 rounded outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600' name='name' value={data.name} onChange={handleChange} placeholder='Enter your name' required />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='email'>Email:</label>
                            <input type='email' id='email' className='bg-white/70 p-2 border border-slate-300 rounded outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600' name='email' value={data.email} onChange={handleChange} placeholder='Enter your email' required />
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='password'>Password:</label>
                            <div className='bg-white/70 p-2 border border-slate-300 rounded flex items-center focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600'>
                                <input type={showPassword ? "text" : "password"} id='password' className='w-full outline-none bg-transparent' name='password' value={data.password} onChange={handleChange} placeholder='Enter your password' required />
                                <div onClick={() => setShowPassword(p => !p)} className='cursor-pointer text-slate-500 hover:text-green-700'>{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</div>
                            </div>
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor='confirmPassword'>Confirm Password:</label>
                            <div className='bg-white/70 p-2 border border-slate-300 rounded flex items-center focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600'>
                                <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' className='w-full outline-none bg-transparent' name='confirmPassword' value={data.confirmPassword} onChange={handleChange} placeholder='Confirm your password' required />
                                <div onClick={() => setShowConfirmPassword(p => !p)} className='cursor-pointer text-slate-500 hover:text-green-700'>{showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}</div>
                            </div>
                        </div>

                        <button disabled={!valideValue} className={`w-full text-white py-2.5 rounded-md font-semibold tracking-wide transition-all ${valideValue ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl" : "bg-slate-400 cursor-not-allowed"}`}>
                            Register
                        </button>
                    </form>

                    <p className='mt-6 text-center text-sm text-slate-700'>
                        Already have an account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800 hover:underline'>Login</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;