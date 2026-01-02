'use client';

import React from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-page-title text-slate-900 dark:text-white">Reports & Analytics</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Business insights and performance metrics
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <BarChart3 className="w-8 h-8 text-teal-500 mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Sales Reports</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Analyze sales performance and trends
                    </p>
                </GlassCard>

                <GlassCard className="p-6">
                    <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Inventory Analytics</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Stock movement and turnover analysis
                    </p>
                </GlassCard>

                <GlassCard className="p-6">
                    <Download className="w-8 h-8 text-brand-lime mb-4" />
                    <h3 className="text-card-title text-slate-900 dark:text-white mb-2">Export Data</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Download reports in various formats
                    </p>
                </GlassCard>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-12 text-center">
                <h3 className="text-section-title text-slate-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Advanced reporting features are under development
                </p>
            </div>
        </div>
    );
}
