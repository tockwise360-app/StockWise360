'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { useTemplateCustomization, SavedTemplate } from '@/lib/hooks/useTemplateCustomization';
import { TemplateSelector } from '@/components/invoices/templates/TemplateSelector';
import { CustomizationPanel } from '@/components/invoices/templates/CustomizationPanel';
import { InvoicePreview } from '@/components/invoices/templates/InvoicePreview';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, Save, Trash2, Clock, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/lib/context/ToastContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';

export default function TemplateBuilderPage() {
    const { theme } = useTheme();
    const {
        selectedTemplateId,
        setSelectedTemplateId,
        customization,
        updateCustomization,
        previewScale,
        setPreviewScale,
        previewData,
        templates,
        savedTemplates,
        saveTemplate,
        loadSavedTemplate,
        deleteTemplate
    } = useTemplateCustomization();

    const { showToast } = useToast();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Keyboard handlers for accessibility (TPL-005)
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isSaveModalOpen) setIsSaveModalOpen(false);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isSaveModalOpen, isMobileMenuOpen]);

    // Error handling wrapper (TPL-010)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTemplateName.trim()) return;

        try {
            setIsSaving(true);
            saveTemplate(newTemplateName);
            setIsSaveModalOpen(false);
            setNewTemplateName('');
            showToast('Template saved successfully!', 'success');
            setActiveTab('saved');
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to save template', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoadTemplate = async (template: SavedTemplate) => {
        try {
            loadSavedTemplate(template);
            setActiveTab('create');
            showToast(`Loaded "${template.name}"`, 'success');
        } catch (error) {
            showToast('Failed to load template', 'error');
        }
    };

    const handleDeleteTemplate = async (templateId: string, templateName: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            deleteTemplate(templateId);
            showToast('Template deleted', 'info');
        } catch (error) {
            showToast('Failed to delete template', 'error');
        }
    };

    // Loading state with theme support (TPL-006)
    if (!mounted) {
        return (
            <div className="h-screen w-full bg-light-base dark:bg-dark-base flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-light-base dark:bg-dark-base overflow-hidden flex-col md:flex-row">
            {/* Save Modal */}
            {isSaveModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="save-modal-title"
                >
                    <GlassCard className="w-full max-w-sm bg-white dark:bg-dark-elevated border-slate-200 dark:border-white/10 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 id="save-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">Save Template</h3>
                            <button
                                onClick={() => setIsSaveModalOpen(false)}
                                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} strokeWidth={2} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="template-name" className="text-sm text-slate-700 dark:text-slate-300">Template Name</label>
                                <input
                                    id="template-name"
                                    autoFocus
                                    type="text"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    placeholder="e.g. My Brand Dark"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSaveModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newTemplateName.trim() || isSaving}
                                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}

            {/* Mobile Header */}
            <div className="md:hidden h-16 border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface flex items-center justify-between px-4 z-30">
                <Link href="/invoices/new" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ArrowLeft size={18} strokeWidth={2} />
                </Link>
                <span className="font-bold text-slate-900 dark:text-white">Invoice Builder</span>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-500/20 transition-colors"
                >
                    Customize
                </button>
            </div>

            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity",
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[400px] bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:w-[400px]",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Sidebar Header */}
                <div className="h-14 border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 bg-slate-50 dark:bg-dark-elevated">
                    <Link href="/invoices/new" className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ArrowLeft size={18} strokeWidth={2} />
                        <span className="font-medium text-sm">Back</span>
                    </Link>
                    <span className="md:hidden font-bold text-slate-900 dark:text-white">Customize</span>

                    {/* Tab Toggle */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="flex rounded-lg bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/5">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    activeTab === 'create'
                                        ? "bg-teal-500 text-white shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    activeTab === 'saved'
                                        ? "bg-teal-500 text-white shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                Saved
                            </button>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        aria-label="Close menu"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                {activeTab === 'create' ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Save Button Section */}
                        <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
                            <h2 className="text-slate-900 dark:text-white font-bold">Design</h2>
                            <button
                                onClick={() => setIsSaveModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/50 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-semibold transition-all"
                            >
                                <Save size={14} strokeWidth={2} /> Save As...
                            </button>
                        </div>

                        {/* Template Selector */}
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-4 border-b border-slate-200 dark:border-dark-border">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Base Template</h3>
                            <TemplateSelector
                                templates={templates}
                                selectedId={selectedTemplateId}
                                onSelect={setSelectedTemplateId}
                            />
                        </div>

                        {/* Customization Panel */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <div className="p-3 bg-slate-50 dark:bg-dark-elevated border-b border-slate-200 dark:border-dark-border">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Customization</h3>
                            </div>
                            <CustomizationPanel
                                customization={customization}
                                onUpdate={updateCustomization}
                            />
                        </div>
                    </div>
                ) : (
                    // Saved Templates List
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        <h2 className="text-slate-900 dark:text-white font-bold mb-4">My Saved Templates</h2>
                        {savedTemplates.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                <Save size={32} className="mx-auto mb-4 opacity-50" strokeWidth={2} />
                                <p>No saved templates yet.</p>
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className="text-teal-600 dark:text-teal-400 text-sm mt-2 hover:underline"
                                >
                                    Create your first template
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {savedTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 hover:border-teal-500/50 dark:hover:border-teal-500/30 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{template.name}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleLoadTemplate(template)}
                                                    className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-500 hover:text-white transition-colors"
                                                    title="Load Template"
                                                    aria-label={`Load ${template.name}`}
                                                >
                                                    <Clock size={16} strokeWidth={2} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                                                    className="p-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Delete Template"
                                                    aria-label={`Delete ${template.name}`}
                                                >
                                                    <Trash2 size={16} strokeWidth={2} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Based on {templates.find(t => t.id === template.templateId)?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                            Last modified: {new Date(template.lastModified).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Preview Area */}
            <div className="flex-1 h-full bg-light-base dark:bg-dark-base relative">
                <InvoicePreview
                    templateId={selectedTemplateId}
                    customization={customization}
                    data={previewData}
                    scale={previewScale}
                    setScale={setPreviewScale}
                />
            </div>
        </div>
    );
}
