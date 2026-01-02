import React from 'react';
import { InvoiceTemplate } from '@/lib/types/invoice';
import { GlassCard } from '@/components/ui/GlassCard';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
    templates: InvoiceTemplate[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export function TemplateSelector({ templates, selectedId, onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => {
                const isSelected = selectedId === template.id;

                return (
                    <GlassCard
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={cn(
                            "cursor-pointer group relative overflow-hidden transition-all duration-300 border-2 p-0",
                            isSelected
                                ? "border-teal-500 bg-teal-500/5 ring-2 ring-teal-500/20"
                                : "border-transparent opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-600"
                        )}
                    >
                        {/* Preview Thumbnail */}
                        <div className="aspect-[1/1.4] bg-slate-100 dark:bg-slate-800 relative w-full overflow-hidden">
                            {/* Placeholder for real thumbnail */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-4xl uppercase tracking-widest opacity-20 rotate-[-12deg]">
                                {template.category}
                            </div>

                            {/* Selection Overlay */}
                            <div className={cn(
                                "absolute inset-0 bg-teal-500/20 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center",
                                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>
                                {isSelected && (
                                    <div className="bg-teal-500 text-white p-3 rounded-full shadow-lg animate-in zoom-in spin-in-12">
                                        <Check size={24} strokeWidth={3} />
                                    </div>
                                )}
                                {!isSelected && (
                                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        Use Template
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info Footer */}
                        <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={cn("font-bold text-sm", isSelected ? "text-teal-600 dark:text-teal-400" : "text-slate-800 dark:text-slate-200")}>
                                        {template.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">{template.description}</p>
                                </div>
                                {template.isPremium && (
                                    <Star size={14} className="text-amber-400 fill-amber-400 shrink-0 mt-1" />
                                )}
                            </div>
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
}
