'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { ArrowPathIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  step: number;
  handleLogin: (data: LoginFormData) => void;
  handleSignup: (data: SignupFormData) => void;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  monthlyIncome: number;
  profileImageUrl?: string;
  bio?: string;
  skills: string;
  interests?: string;
}

type FormData = LoginFormData & Partial<SignupFormData>;

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const signupSchemas = [
  yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  }),
  yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    phoneNumber: yup.string().matches(/^[0-9]+$/, 'Phone Number must be digits only').required('Phone Number is required'),
  }),
  yup.object().shape({
    monthlyIncome: yup.number().typeError('Monthly Income must be a number').required('Monthly Income is required'),
    profileImageUrl: yup.string().url('Invalid URL'),
    bio: yup.string(),
    skills: yup.string().required('Skills are required'),
    interests: yup.string(),
  }),
];

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  isLoading,
  step,
  handleLogin,
  handleSignup,
  setStep,
  setIsLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const schema:any = isLogin ? loginSchema : signupSchemas[step - 1];

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  useEffect(() => {
    // Reset the form fields when toggling between login and signup
    if (isLogin) {
      reset(); // Clear form values when switching to login
    } else {
      reset({
        email: watch('email') || '', // Watch the email value from login form
      });
    }
    setStep(1); // Reset the step to the first step
  }, [isLogin, reset, watch, setStep]);
  
  const onSubmit = (data: FormData) => {
    if (isLogin) {
      handleLogin(data as LoginFormData);
    } else if (step === 3) {
      handleSignup(data as SignupFormData);
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger();
  if (isValid) {
    setStep(step + 1);
  }

  };

  const renderField = (name: keyof FormData, type: string, placeholder: string) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="relative">
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`w-full ${errors[name] ? 'border-red-500' : ''}`}
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
        </div>
      )}
    />
  );

  const renderPasswordField = () => (
    <div className="relative">
      <Input
        {...control.register('password')}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className={`w-full ${errors.password ? 'border-red-500' : ''}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center"
      >
        {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
      </button>
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
    </div>
  );

  const loginFields = [
    renderField('email', 'email', 'Email'),
    renderPasswordField(),
  ];

  const signupFields = [
    step === 1 && renderField('username', 'text', 'Username'),
    step === 1 && renderField('email', 'email', 'Email'),
    step === 1 && renderPasswordField(),
    step === 2 && renderField('firstName', 'text', 'First Name'),
    step === 2 && renderField('lastName', 'text', 'Last Name'),
    step === 2 && renderField('phoneNumber', 'tel', 'Phone Number'),
    step === 3 && renderField('monthlyIncome', 'number', 'Monthly Income'),
    step === 3 && renderField('profileImageUrl', 'url', 'Profile Image URL'),
    step === 3 && (
      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Short bio"
            className={`w-full ${errors.bio ? 'border-red-500' : ''}`}
          />
        )}
      />
    ),
    step === 3 && renderField('skills', 'text', 'Skills'),
    step === 3 && renderField('interests', 'text', 'Interests'),
  ].filter(Boolean);
  

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-blue-600">
          {isLogin ? 'Welcome Back!' : 'Join Us Today'}
        </h2>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {isLogin ? loginFields : signupFields}
          <Button
            type={isLogin || step === 3 ? "submit" : "button"}
            onClick={!isLogin && step < 3 ? handleNextStep : undefined}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500"
            disabled={isLoading}
          >
            {isLoading ? <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : (step < 3 ? 'Next' : 'Sign Up')}
                {!isLogin && step < 3 && <ArrowRightIcon className="h-5 w-5 ml-2" />}
              </>
            )}
          </Button>
        </motion.form>
        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setStep(1);
            }}
            className="ml-1 text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;