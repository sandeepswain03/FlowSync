import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { axiosInstance } from '@/Instance/axiosInstance';
import { UserContext } from '../../context/UserContext';
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axiosInstance.post("/user/login", {
                email: data.email,
                password: data.password,
            });

            if (response.status === 200) {
                const user = response.data.data.loggedInUser;
                setUser(user);
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row bg-white">
            <motion.div
                className="flex-1 hidden lg:flex items-center justify-center p-12"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-lg">
                    <div className="text-center font-bold mb-8">
                        <h2 className="text-6xl text-gray-800">Welcome back</h2>
                    </div>
                    <img
                        src="/public/Sign-Up.jpg"
                        alt="Sign in illustration"
                        className="w-full h-auto"
                    />
                </div>
            </motion.div>
            <motion.div
                className="flex-1 flex items-center justify-center p-8 bg-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full max-w-md space-y-8">
                    <div className="text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Sign in to your account</h2>
                        <p className="mt-2 text-gray-600 text-lg">Welcome back! Please enter your details</p>
                    </div>

                    {error && (
                        <motion.div
                            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-red-700">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="relative">
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 border-2 rounded-lg peer placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Email"
                            />
                            <label className="absolute left-3 -top-6 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm">
                                Email
                            </label>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full px-4 py-3 border-2 rounded-lg peer placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Password"
                            />
                            <label className="absolute left-3 -top-6 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm">
                                Password
                            </label>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full bg-[#DBFF17] text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-[#163341] hover:text-white transition-all shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </motion.button>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <motion.button
                                    type="button"
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                    onClick={() => navigate('/sign-up')}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Sign up
                                </motion.button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;