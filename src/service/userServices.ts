import { LoginResponse, LoginUserData, SignupResponse, SignupUserData } from '@/interface/UsersInterface';
import axiosInstance from '.';

const login = async (userData: LoginUserData): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/api/signIn', userData);
    const data = response.data;

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      userId: data.userId,
    }));

    return data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

const signup = async (userData: SignupUserData): Promise<SignupResponse> => {
  try {
    const response = await axiosInstance.post('/api/signIn', userData);
    return response.data;
  } catch (error) {
    throw new Error('Signup failed');
  }
};

export default {
    login,
    signup
}