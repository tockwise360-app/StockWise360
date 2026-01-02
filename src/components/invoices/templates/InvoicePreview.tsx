import React, { useRef } from 'react';
import { InvoiceRenderer } from './InvoiceRenderer';
import { InvoiceData, TemplateCustomization } from '@/lib/types/invoice';
import { ZoomIn, ZoomOut, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { jsPDF } from 'jspdf'; // Future integration
// import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
    templateId: string;
    customization: TemplateCustomization;
    data: InvoiceData;
    scale: number;
    setScale: (scale: number) => void;
}

export function InvoicePreview({ templateId, customization, data, scale, setScale }: InvoicePreviewProps) {
    const previewRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-[#020617] relative">
            {/* Toolbar */}
            <div className="h-12 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B1120] flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500"
                    >
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-xs font-mono w-12 text-center">{(scale * 100).toFixed(0)}%</span>
                    <button
                        onClick={() => setScale(Math.min(1.5, scale + 0.1))}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500"
                    >
                        <ZoomIn size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
                    >
                        <Printer size={16} /> Print
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-teal-500/20">
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Scrollable Preview Area */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center custom-scrollbar">
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        width: '210mm', // A4 width
                        minHeight: '297mm', // A4 height
                    }}
                    className="shadow-2xl transition-transform duration-200"
                >
                    <InvoiceRenderer
                        templateId={templateId}
                        customization={customization}
                        data={data}
                        className="w-full min-h-full bg-white"
                    />
                </div>
            </div>
        </div>
    );
}
