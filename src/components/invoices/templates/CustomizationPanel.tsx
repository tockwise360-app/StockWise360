import React from 'react';
import { TemplateCustomization } from '@/lib/types/invoice';
import { Palette, Type, Image as ImageIcon, Layout, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';

interface CustomizationPanelProps {
    customization: TemplateCustomization;
    onUpdate: (section: keyof TemplateCustomization, updates: any) => void;
}

export function CustomizationPanel({ customization, onUpdate }: CustomizationPanelProps) {
    const [openSection, setOpenSection] = React.useState<string | null>('colors');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id: string }) => (
        <button
            onClick={() => toggleSection(id)}
            className={cn(
                "w-full flex items-center justify-between p-4 text-left transition-colors border-b border-white/5",
                openSection === id ? "bg-white/5 text-white" : "text-slate-400 hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="font-semibold text-sm">{title}</span>
            </div>
            <ChevronDown size={16} className={cn("transition-transform", openSection === id && "rotate-180")} />
        </button>
    );

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-[#0B1120] border-r border-white/5">
            {/* Colors Section */}
            <div>
                <SectionHeader icon={Palette} title="Colors & Branding" id="colors" />
                {openSection === 'colors' && (
                    <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500">Primary Color</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={customization.colors.primary}
                                        onChange={(e) => onUpdate('colors', { primary: e.target.value })}
                                        className="h-8 w-8 rounded-lg overflow-hidden cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customization.colors.primary}
                                        onChange={(e) => onUpdate('colors', { primary: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-md h-8 w-20 text-xs px-2 text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500">Accent Color</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={customization.colors.accent}
                                        onChange={(e) => onUpdate('colors', { accent: e.target.value })}
                                        className="h-8 w-8 rounded-lg overflow-hidden cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs text-slate-500">Logo Size</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['small', 'medium', 'large'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => onUpdate('branding', { logoSize: size })}
                                        className={cn(
                                            "py-1.5 text-xs rounded-md border text-center capitalize transition-all",
                                            customization.branding.logoSize === size
                                                ? "bg-teal-500/20 border-teal-500 text-teal-400"
                                                : "bg-white/5 border-transparent text-slate-400"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs text-slate-500">Logo Alignment</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => onUpdate('branding', { logoAlignment: align })}
                                        className={cn(
                                            "py-1.5 text-xs rounded-md border text-center capitalize transition-all",
                                            customization.branding.logoAlignment === align
                                                ? "bg-teal-500/20 border-teal-500 text-teal-400"
                                                : "bg-white/5 border-transparent text-slate-400"
                                        )}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs text-slate-500">Background</label>
                            <div className="flex gap-2">
                                {[
                                    { label: 'White', value: '#ffffff' },
                                    { label: 'Cream', value: '#fdfbf7' },
                                    { label: 'Gray', value: '#f8fafc' }
                                ].map((bg) => (
                                    <button
                                        key={bg.value}
                                        onClick={() => onUpdate('colors', { background: bg.value })}
                                        className={cn(
                                            "flex-1 py-1.5 text-xs rounded-md border text-center transition-all",
                                            customization.colors.background === bg.value
                                                ? "bg-teal-500/20 border-teal-500 text-teal-400"
                                                : "bg-white/5 border-transparent text-slate-400"
                                        )}
                                    >
                                        {bg.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Layout Section */}
            <div>
                <SectionHeader icon={Layout} title="Layout & Type" id="layout" />
                {openSection === 'layout' && (
                    <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500">Invoice Title</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Tax Invoice', 'Proforma', 'Estimate'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => onUpdate('layout', { type })}
                                        className={cn(
                                            "py-1.5 text-xs rounded-md border text-center transition-all truncate px-1",
                                            customization.layout.type === type
                                                ? "bg-teal-500/20 border-teal-500 text-teal-400"
                                                : "bg-white/5 border-transparent text-slate-400"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500">Heading Font</label>
                            <select
                                value={customization.fonts.heading}
                                onChange={(e) => onUpdate('fonts', { heading: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-md h-9 text-sm px-3 text-white outline-none"
                            >
                                <option value="Inter">Inter (Sans)</option>
                                <option value="Playfair Display">Playfair (Serif)</option>
                                <option value="Montserrat">Montserrat (Bold)</option>
                                <option value="Space Mono">Space Mono (Tech)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div>
                <SectionHeader icon={FileText} title="Content & Fields" id="content" />
                {openSection === 'content' && (
                    <div className="p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 mb-2 block">Visible Fields</label>
                            {Object.entries(customization.fields).map(([key, value]) => (
                                <label key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => onUpdate('fields', { [key]: e.target.checked })}
                                        className="rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500/50"
                                    />
                                    <span className="text-sm text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <label className="text-xs text-slate-500">Footer Note</label>
                            <textarea
                                value={customization.footer.content}
                                onChange={(e) => onUpdate('footer', { content: e.target.value })}
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-md text-xs p-3 text-white outline-none resize-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
