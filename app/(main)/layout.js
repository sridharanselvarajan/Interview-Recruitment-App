import { Toaster } from 'sonner';
import DashboardProvider from './provider';

function DashboardLayout({children}) {
    return(
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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