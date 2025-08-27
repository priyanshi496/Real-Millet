import React, { useState} from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import AuthMascot from '../components/AuthMascot.jsx'; // Mascot for feedback
import backgroundImage from '../assets/millet-field-background.png'; 

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
  
    const [mascot, setMascot] = useState({ message: 'Hello! Please enter your details to log in.', type: 'default' });
    const navigate = useNavigate();
    const dispatch = useDispatch();

   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => ({ ...preve, [name]: value }));

        // Make the AuthMascot react as the user types
        if (!value) {
            setMascot({ message: `Don't forget to enter your ${name}!`, type: 'error' });
        } else {
            setMascot({ message: 'Looking good! Keep going...', type: 'default' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.email || !data.password) {
            setMascot({ message: 'Oops! It looks like you missed a field.', type: 'error' });
            return;
        }

        setMascot({ message: 'Checking your details... Hold on!', type: 'default' });

        try {
            const response = await Axios({ ...SummaryApi.login, data: data });

            if (response.data.error) {
                toast.error(response.data.message);
                setMascot({ message: response.data.message, type: 'error' });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setMascot({ message: 'Success! Taking you to the homepage.', type: 'success' });
                
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));
                
                setTimeout(() => navigate("/"), 1500); // Wait for the success message to be seen
            }
        } catch (error) {
            AxiosToastError(error);
            setMascot({ message: 'Uh oh, something went wrong. Please try again.', type: 'error' });
        }
    };

    return (
        <section 
            className='min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-cover bg-center'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className='relative w-full max-w-md mx-auto'>
               
               

                {/* Login Card */}
                <div className='relative z-10 bg-white/80 backdrop-blur-md my-4 rounded-xl p-8 shadow-2xl'>
                    
                    {/* Interactive AuthMascot for feedback */}
                    <AuthMascot message={mascot.message} type={mascot.type} />

                    <h1 className='text-3xl font-bold text-center text-green-800 -mt-4'>Welcome Back!</h1>
                    
                    <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
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
                            <Link to={"/forgot-password"} className='block w-fit ml-auto text-sm text-slate-600 hover:text-green-700 hover:underline'>Forgot password?</Link>
                        </div>

                        <button className='w-full text-white py-2.5 rounded-md font-semibold tracking-wide transition-all bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'>
                            Login
                        </button>
                    </form>

                    <p className='mt-6 text-center text-sm text-slate-700'>
                        Don't have an account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800 hover:underline'>Register</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;