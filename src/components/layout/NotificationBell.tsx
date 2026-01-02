import React from 'react';
import { Bell } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { Alert } from '@/lib/store/features/inventorySlice';

interface NotificationBellProps {
    onClick: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
    const { alerts } = useAppSelector((state) => state.inventory);
    const unreadCount = alerts.filter((a: Alert) => !a.isRead).length;

    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-teal-600 transition-colors duration-200"
            aria-label="Notifications"
        >
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#020617] animate-pulse pointer-events-none" />
            )}
        </button>
    );
}
