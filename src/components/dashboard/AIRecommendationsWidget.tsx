'use client';

import { Sparkles, ArrowRight, X } from 'lucide-react';

const INSIGHTS = [
    {
        id: 1,
        type: 'critical',
        title: 'Likely Stockout Alert',
        message: 'Product "X" is predicted to run out in 5 days based on current velocity.',
        action: 'Reorder Now'
    },
    {
        id: 2,
        type: 'warning',
        title: 'Margin Opportunity',
        message: 'Competitors raised prices on "Y". You can increase price by 5%.',
        action: 'Review Pricing'
    },
    {
        id: 3,
        type: 'info',
        title: 'Efficiency Tip',
        message: 'Consider bundling slow-moving "Z" with top-seller "A" to clear stock.',
        action: 'Create Bundle'
    }
];

export function AIRecommendationsWidget() {
    return (
        <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/30 rounded-full blur-[50px]"></div>

            <div className="flex justify-between items-center mb-6 z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-300 animate-pulse" />
                    <h3 className="text-xl font-bold text-white tracking-tight">AI Assistant</h3>
                </div>
                <span className="text-[10px] font-bold bg-violet-500/20 text-violet-200 px-2 py-1 rounded-lg border border-violet-500/20">BETA</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar z-10">
                {INSIGHTS.map((insight) => (
                    <div key={insight.id} className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5 hover:bg-black/30 hover:border-violet-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${insight.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                                    insight.type === 'warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                {insight.title}
                            </span>
                            <button className="text-white/20 hover:text-white transition-colors"><X size={14} /></button>
                        </div>
                        <p className="text-sm font-medium text-zinc-300 mb-3 leading-relaxed">
                            {insight.message}
                        </p>
                        <button className="w-full py-2.5 rounded-xl text-xs font-bold transition-all bg-white/10 hover:bg-white/20 text-white flex items-center justify-center group-hover:shadow-lg">
                            {insight.action} <ArrowRight size={12} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
