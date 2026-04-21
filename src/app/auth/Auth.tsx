import { useAuthStore } from './authStore';
import { useAuthForm, useSignInMutation, useSignUpMutation, handleRedirect } from './hooks';
import { TabToggle, LoginForm, RegisterForm } from './components';
import LandingFooter from '@/layouts/LandingFooter';

export default function Sign() {
  const { login, getUserRole } = useAuthStore();
  const { activeTab, setActiveTab, signInData, setSignInData, signUpData, setSignUpData } = useAuthForm();

  const handleAuthSuccess = (token: string) => {
    login(token);
    const userRole = getUserRole();
    handleRedirect(userRole);
  };

  const signInMutation = useSignInMutation(handleAuthSuccess);
  const signUpMutation = useSignUpMutation(handleAuthSuccess);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInMutation.mutate(signInData);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUpMutation.mutate(signUpData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'login' ? (
            <LoginForm
              data={signInData}
              onChange={setSignInData}
              onSubmit={handleSignInSubmit}
              isLoading={signInMutation.isPending}
            />
          ) : (
            <RegisterForm
              data={signUpData}
              onChange={setSignUpData}
              onSubmit={handleSignUpSubmit}
              isLoading={signUpMutation.isPending}
            />
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}