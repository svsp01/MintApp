'use client'

import React, { useState ,FormEvent} from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from './AuthForm'; 
import userServices from '@/service/userServices';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    monthlyIncome: '',
    profileImageUrl: '',
    bio: '',
    skills: '',
    interests: ''
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await userServices.login({
        email: formData.email,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await userServices.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        monthlyIncome: Number(formData.monthlyIncome),
        profileImageUrl: formData.profileImageUrl,
        bio: formData.bio,
        skills: formData.skills,
        interests: formData.interests,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <AuthForm
      isLogin={isLogin}
      step={step}
      formData={formData}
      handleChange={handleChange}
      handleLogin={handleLogin}
      handleSignup={handleSignup}
      setStep={setStep}
      setIsLogin={setIsLogin}
    />
  );
};

export default LoginPage;
