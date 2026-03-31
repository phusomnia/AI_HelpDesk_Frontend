import React from 'react';
import Sidemenu from '@/layouts/SideMenu'
import { useAuthStore } from '@/app/auth/authStore';
import Header from './Header';
import { logger } from '@/utils/logger';

export function ManagementLayout({ children }: any) {
    const { payload, logout } = useAuthStore()
    logger.info(payload)

    return (
        <div className="flex min-h-screen">
            <Sidemenu isOpen={true} />
            <div className="flex-1 flex flex-col">
                <Header username={payload?.username} onLogout={logout} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
