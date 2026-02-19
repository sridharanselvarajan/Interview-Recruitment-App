import React from 'react';
import DashboardProvider from './provider';
import { Toaster } from 'sonner';

function DashboardLayout({children}) {
    return(
        <div>
            <DashboardProvider>
                <div className='p-10'>
                {children}
                <Toaster/>
                </div>
            </DashboardProvider>
        </div>
    )
}

export default DashboardLayout;