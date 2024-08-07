import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/auth/login');
    }

    return (
        <div className='flex bg-main-bg bg-cover bg-top h-full'>
            <div className="fixed flex h-screen w-48 flex-col gap-6 bg-background-100 text-white justify-between py-4 px-4">
                <div className='flex flex-col gap-5'>
                    <div>
                        <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? "w-full text-font-accent" : "w-full hover:text-gray-300"}>Dashboard</NavLink>
                    </div>
                    <div>
                        <NavLink to="/admin/jobs" className={({ isActive, isPending }) => isActive || isPending ? "w-full text-font-accent" : "w-full hover:text-gray-300"} >Jobs</NavLink>
                    </div>
                    <div>
                        <NavLink to="/admin/candidates" className={({ isActive, isPending }) => isActive || isPending ? "text-font-accent" : "hover:text-gray-300"}>Candidates</NavLink>
                    </div>
                    <div>
                        <NavLink to="/admin/reviews" className={({ isActive, isPending }) => isActive || isPending ? "text-font-accent" : "hover:text-gray-300"}>Reviews</NavLink>
                    </div>
                    <div>
                        <NavLink to="/admin/reports" className={({ isActive, isPending }) => isActive || isPending ? "text-font-accent" : "hover:text-gray-300"}>Reports</NavLink>
                    </div>
                </div>
                <div>
                    <button onClick={handleLogout} className="bg-black text-white font-bold py-2 px-4 rounded">LOGOUT</button>
                </div>
            </div>

            <div className='ml-[200px] w-full h-full p-3'>
                <Outlet />
            </div>
        </div>
    );
};

export default Navbar;
