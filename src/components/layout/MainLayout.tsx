import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white border-t py-8 text-center text-sm text-gray-500">
                <p>© 2024 Placement Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};
