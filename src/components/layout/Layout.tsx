import { Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <ThemeToggle />
            <main className="">
                <Outlet />
            </main>
        </div>
    )
}