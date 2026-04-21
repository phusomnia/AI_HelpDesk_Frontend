import { useAuthStore } from '@/app/auth/authStore';
import { PUBLIC_API_BASE_URL } from '@/constants/constant';

export const useAccessRedirect = () => {
  const { token } = useAuthStore();

  const getRedirectUrl = async (): Promise<string> => {
    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v1/auth/access`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get access redirect');
      }

      const data = await response.json();
      return data.data.redirect_url;
    } catch (error) {
      console.error('Error getting access redirect:', error);
      // Fallback to client-side logic
      const { payload } = useAuthStore.getState();
      const role = payload?.role;

      if (role === 'CUSTOMER') {
        return '/user_portal';
      } else if (role === 'AGENT' || role === 'ADMIN') {
        return '/management';
      }
      return '/user_portal';
    }
  };

  const navigateToRoleBasedPage = async () => {
    const redirectUrl = await getRedirectUrl();
    window.location.href = redirectUrl;
  };

  return {
    getRedirectUrl,
    navigateToRoleBasedPage,
  };
};
