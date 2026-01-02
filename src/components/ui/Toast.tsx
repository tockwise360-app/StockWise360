'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    undoAction?: () => void;
    onClose: () => void;
}

export function Toast({ type, message, undoAction, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Trigger enter animation
    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    const handleUndo = () => {
        if (undoAction) {
            undoAction();
            handleClose();
        }
    };

    const icons = {
        success: <CheckCircle size={20} className="text-emerald-400" />,
        error: <AlertCircle size={20} className="text-red-400" />,
        info: <AlertCircle size={20} className="text-blue-400" />,
    };

    const styles = {
        success: 'bg-[#0f172a]/90 border-emerald-500/20 text-emerald-50 shadow-emerald-500/10',
        error: 'bg-[#0f172a]/90 border-red-500/20 text-red-50 shadow-red-500/10',
        info: 'bg-[#0f172a]/90 border-blue-500/20 text-blue-50 shadow-blue-500/10',
    };

    return (
        <div
            className={cn(
                "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0",
                styles[type],
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
            role="alert"
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium pr-2">{message}</p>

            {undoAction && (
                <button
                    onClick={handleUndo}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-900 bg-white rounded-lg hover:bg-slate-200 transition-colors ml-2"
                >
                    <RefreshCcw size={12} />
                    UNDO
                </button>
            )}

            <button
                onClick={handleClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-1"
                aria-label="Close notification"
            >
                <X size={16} className="text-slate-400 hover:text-white" />
            </button>
        </div>
    );
}
