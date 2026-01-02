'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Menu, X, Bell, Sun, Moon,
    Settings, LogOut, User, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
    userInitial?: string;
    userName?: string;
}

export default function Header({
    userInitial = 'A',
    userName = 'Alex Mitchell'
}: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Refs for click outside
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Mock Notifications
    const notifications = [
        { id: 1, text: 'Low stock alert: Premium Leather Wallet', time: '2m ago', unread: true },
        { id: 2, text: 'New order #1234 received', time: '1h ago', unread: true },
        { id: 3, text: 'Monthly report ready', time: '5h ago', unread: false },
        { id: 4, text: 'System update scheduled', time: '1d ago', unread: false },
        { id: 5, text: 'Welcome to StockWise360', time: '2d ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    // Theme Toggle Logic
    useEffect(() => {
        // Check initial preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }

        // Scroll handler for shadow
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300 border-b",
            scrolled
                ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-lg"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 lg:h-16">

                    {/* Left: Logo & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            aria-label="Open menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="relative flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500 tracking-tight">
                                StockWise<span className="text-teal-400 font-light">360</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation (Placeholder) */}
                    <nav className="hidden md:flex space-x-8">
                        {/* Add nav links here if needed in future */}
                    </nav>

                    {/* Right: User Controls */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all relative focus:outline-none focus:ring-2 focus:ring-teal-500"
                                aria-label="View notifications"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Notifications</h3>
                                        <span className="text-[10px] font-black text-brand-teal cursor-pointer hover:underline uppercase tracking-widest">Mark all read</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="px-4 py-3 hover:bg-gray-700/30 transition-colors border-b border-gray-800 last:border-0 cursor-pointer group">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm ${notif.unread ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                        {notif.text}
                                                    </p>
                                                    {notif.unread && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-700 bg-gray-800/50 text-center">
                                        <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">View All History</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 group"
                            >
                                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-tr from-lime-400 to-green-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
                                        {userInitial}
                                    </div>
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-semibold text-gray-200 group-hover:text-white">{userName}</p>
                                </div>
                                <ChevronDown size={16} className="text-gray-400 hidden lg:block group-hover:text-white" />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-1 lg:hidden">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{userName}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Administrator</p>
                                    </div>
                                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors">
                                        <User size={16} className="text-brand-teal" /> Profile
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors">
                                        <Settings size={16} className="text-brand-teal" /> Settings
                                    </button>
                                    <div className="my-1 border-t border-slate-100 dark:border-white/5"></div>
                                    <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors">
                                        <LogOut size={16} /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-[#1F2937] border-b border-gray-700 shadow-xl animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-2 space-y-1">
                        {['Dashboard', 'Inventory', 'Invoices', 'Reports', 'Settings'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
