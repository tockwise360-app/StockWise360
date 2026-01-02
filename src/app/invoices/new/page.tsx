'use client';

import React, { useState } from 'react';
import { InvoiceEditorForm } from '@/components/invoices/InvoiceEditorForm';
import { InvoicePreview } from '@/components/invoices/InvoicePreview';
import { useTemplateCustomization } from '@/lib/hooks/useTemplateCustomization';
import { useInvoices } from '@/hooks/useInvoices';
import { useToast } from '@/lib/context/ToastContext';
import { useRouter } from 'next/navigation';
import { Menu, X, Download, Printer, FileText, Palette, Save } from 'lucide-react';
import Link from 'next/link';

type ZoomLevel = 50 | 75 | 100 | 'fit' | 'fill';

export default function NewInvoicePage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(75);
    const [isSaving, setIsSaving] = useState(false);

    // Shared template customization state
    const templateCustomization = useTemplateCustomization();

    // Invoice actions
    const { currentInvoice, saveInvoice, resetInvoice } = useInvoices();
    const { showToast } = useToast();
    const router = useRouter();

    const getZoomScale = () => {
        if (typeof zoomLevel === 'number') return zoomLevel / 100;
        if (zoomLevel === 'fit') return 0.6;
        if (zoomLevel === 'fill') return 0.85;
        return 1;
    };

    const zoomButtons: { level: ZoomLevel; label: string }[] = [
        { level: 50, label: '50%' },
        { level: 75, label: '75%' },
        { level: 100, label: '100%' },
        { level: 'fit', label: 'Fit' },
        { level: 'fill', label: 'Fill' }
    ];

    const handleSaveInvoice = () => {
        // Validate required fields
        if (!currentInvoice.customerName) {
            showToast('Please select a customer before saving', 'error');
            return;
        }
        if (currentInvoice.items.length === 0) {
            showToast('Please add at least one item to the invoice', 'error');
            return;
        }

        setIsSaving(true);

        // Save the invoice to Redux store
        saveInvoice();

        // Show success toast
        showToast(`Invoice ${currentInvoice.invoiceNumber} saved successfully!`, 'success');

        // Navigate to invoice history
        setTimeout(() => {
            router.push('/invoices');
        }, 500);
    };

    const handleDiscard = () => {
        resetInvoice();
        showToast('Invoice discarded', 'info');
        router.push('/invoices');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-black overflow-hidden">
            {/* Top Control Bar */}
            <div className="h-14 bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 z-30 shadow-sm shrink-0 print:hidden">
                {/* Left: Sidebar Toggle & Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="hidden sm:flex items-center gap-2">
                        <FileText size={18} className="text-brand-teal" />
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white">Invoice Editor</h1>
                        <span className="text-xs text-slate-400 ml-2">#{currentInvoice.invoiceNumber}</span>
                    </div>
                </div>

                {/* Center: Zoom Controls (Desktop) */}
                <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
                    {zoomButtons.map(({ level, label }) => (
                        <button
                            key={level}
                            onClick={() => setZoomLevel(level)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${zoomLevel === level
                                    ? 'bg-brand-teal text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/invoices/templates"
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors"
                    >
                        <Palette size={14} />
                        <span className="hidden md:inline">Customize</span>
                    </Link>
                    <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors">
                        <Download size={14} />
                        <span className="hidden md:inline">PDF</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-teal transition-colors"
                    >
                        <Printer size={14} />
                        <span className="hidden md:inline">Print</span>
                    </button>

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

                    {/* Save Actions */}
                    <button
                        onClick={handleDiscard}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSaveInvoice}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-brand-teal hover:bg-teal-600 rounded-lg shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={14} />
                        {isSaving ? 'Saving...' : 'Save Invoice'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Collapsible Editor Sidebar */}
                <div
                    className={`bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border overflow-hidden transition-all duration-300 ease-in-out shrink-0 print:hidden ${sidebarOpen ? 'w-full lg:w-[420px]' : 'w-0'
                        }`}
                >
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <InvoiceEditorForm templateCustomization={templateCustomization} />
                    </div>
                </div>

                {/* Full-Width Preview Panel */}
                <div className="flex-1 bg-slate-200 dark:bg-[#0f172a] overflow-y-auto overflow-x-hidden custom-scrollbar print:bg-white print:overflow-visible">
                    <div className="min-h-full flex items-start justify-center p-4 lg:p-8 print:p-0">
                        {/* Page Indicator */}
                        <div className="fixed top-20 right-8 bg-white dark:bg-dark-surface px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold text-slate-600 dark:text-slate-400 z-10 hidden lg:block print:hidden">
                            Page 1 of 1
                        </div>

                        {/* Invoice Viewport */}
                        <div
                            className="transition-transform duration-200 ease-out origin-top mt-4 print:transform-none print:mt-0"
                            style={{ transform: `scale(${getZoomScale()})` }}
                        >
                            <InvoicePreview templateCustomization={templateCustomization} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
