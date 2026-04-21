import { useState } from 'react';
import type { SignInData, SignUpData } from '../types';
import { ROLE_CUSTOMER } from '../constants/authConstants';

export function useAuthForm() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [signInData, setSignInData] = useState<SignInData>({
    username: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: '',
    email: '',
    password: '',
    role: ROLE_CUSTOMER,
    department_id: '',
  });

  return {
    activeTab,
    setActiveTab,
    signInData,
    setSignInData,
    signUpData,
    setSignUpData,
  };
}
