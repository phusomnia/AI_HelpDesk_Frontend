import React from 'react';
import Sidemenu from '@/layouts/SideMenu'

export function ManagementLayout({children}: any) {
    return (
        <div className="flex min-h-screen">
            <Sidemenu isOpen={true} />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    )
}