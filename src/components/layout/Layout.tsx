import { Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import landingLogoBlue from '../../assets/images/landinglogoblue.png'

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* <ThemeToggle /> */}
            <main className="">
                <div className='p-4 md:hidden'>
                    <img
                        alt="logo"
                        src={landingLogoBlue}
                        className="mx-auto mt-4"
                    />                
                </div>
                <Outlet />
            </main>
        </div>
    )
}