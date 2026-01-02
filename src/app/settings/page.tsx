'use client';

import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-page-title text-slate-900 dark:text-white">Settings</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Customize your StockWise360 experience
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <User className="w-8 h-8 text-teal-500 mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Profile</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Manage your account information
                    </p>
                </GlassCard>

                <GlassCard className="p-6">
                    <Bell className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Notifications</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Configure notification preferences
                    </p>
                </GlassCard>

                <GlassCard className="p-6">
                    <Palette className="w-8 h-8 text-brand-lime mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Appearance</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Theme and display settings
                    </p>
                </GlassCard>

                <GlassCard className="p-6">
                    <Shield className="w-8 h-8 text-red-500 mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Security</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Password and security options
                    </p>
                </GlassCard>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-12 text-center">
                <h3 className="text-section-title text-slate-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Settings interface is under development
                </p>
            </div>
        </div>
    );
}
