import type { ReactNode } from 'react';
import { useAuthStore } from '@/app/auth/authStore';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'AGENT' | 'ADMIN';
  fallback?: ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRole,
  fallback = null
}) => {
  const { token, getUserRole } = useAuthStore();
  
  if (!token) {
    return fallback || <div className=''><a href="/auth">Vui lòng đăng nhập</a></div>;
  }
  
  if (requiredRole) {
    const userRole = getUserRole();
    if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
      return fallback || <div>Access denied. Admin only.</div>;
    }
    if (requiredRole === 'AGENT' && !['AGENT', 'ADMIN'].includes(userRole)) {
      return fallback || <div>Access denied. Agent or Admin only.</div>;
    }
  }
  
  return <>{children}</>;
};
