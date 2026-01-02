import React from 'react';
import { X, AlertTriangle, Check, Trash2, ArrowRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { markAlertAsRead, clearAlerts, Alert } from '@/lib/store/features/inventorySlice';
import { cn } from '@/lib/utils'; // Assuming you have utility for classes

interface AlertDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AlertDrawer({ isOpen, onClose }: AlertDrawerProps) {
    const dispatch = useAppDispatch();
    const { alerts } = useAppSelector((state) => state.inventory);
    const unreadCount = alerts.filter(a => !a.isRead).length;

    const handleMarkRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(markAlertAsRead(id));
    };

    const handleClearAll = () => {
        dispatch(clearAlerts());
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-[#0f172a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-white/5 flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                Notifications
                            </h2>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-3 px-1.5 py-0.5 bg-brand-teal text-white text-[10px] font-bold rounded-full min-w-[18px] text-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {alerts.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="p-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                                title="Clear All"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {alerts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 text-center p-8">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                <Check size={32} className="text-teal-500" />
                            </div>
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-medium mb-1">All caught up!</h3>
                                <p className="text-sm">No new alerts at the moment.</p>
                            </div>
                        </div>
                    ) : (
                        alerts.map((alert: Alert) => (
                            <div
                                key={alert.id}
                                className={cn(
                                    "group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                                    alert.isRead
                                        ? "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-75"
                                        : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        alert.type === 'low-stock'
                                            ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                                            : "bg-blue-100 text-blue-600"
                                    )}>
                                        <AlertTriangle size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={cn(
                                                "text-sm font-semibold truncate pr-6",
                                                alert.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                                            )}>
                                                {alert.message}
                                            </p>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>

                                        {!alert.isRead && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleMarkRead(alert.id, e)}
                                                    className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline flex items-center gap-1"
                                                >
                                                    Mark as read <Check size={12} />
                                                </button>
                                                {alert.type === 'low-stock' && (
                                                    <>
                                                        <span className="text-slate-300">|</span>
                                                        <button className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors flex items-center gap-1">
                                                            Reorder <ArrowRight size={12} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {!alert.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {alerts.length > 0 && (
                    <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                        <button
                            onClick={handleClearAll}
                            className="w-full py-2.5 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:text-red-500 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            Dismiss All Alerts
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
