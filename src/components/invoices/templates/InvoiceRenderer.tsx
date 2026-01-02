import React from 'react';
import { InvoiceData, TemplateCustomization } from '@/lib/types/invoice';
import { cn } from '@/lib/utils';
import { QrCode } from 'lucide-react'; // Placeholder for real QR

interface InvoiceRendererProps {
    templateId: string;
    customization: TemplateCustomization;
    data: InvoiceData;
    className?: string;
}

export function InvoiceRenderer({ templateId, customization, data, className }: InvoiceRendererProps) {
    const { colors, fonts, branding, layout, fields, footer } = customization;

    // Dynamic Style Object
    const style = {
        '--primary': colors.primary,
        '--secondary': colors.secondary,
        '--accent': colors.accent,
        '--bg-color': colors.background,
        '--text-color': colors.text,
        '--font-heading': fonts.heading,
        '--font-body': fonts.body,
        '--scale': fonts.sizeScale,
    } as React.CSSProperties;

    const Logo = () => (
        branding.showLogo ? (
            branding.logo ? (
                <img
                    src={branding.logo}
                    alt="Logo"
                    className={cn(
                        "object-contain mb-4",
                        branding.logoSize === 'small' ? 'h-12' : branding.logoSize === 'medium' ? 'h-20' : 'h-32'
                    )}
                />
            ) : (
                <div className={cn(
                    "bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 font-bold mb-4",
                    branding.logoSize === 'small' ? 'h-12 w-12' : branding.logoSize === 'medium' ? 'h-20 w-20' : 'h-32 w-32'
                )}>
                    LOGO
                </div>
            )
        ) : null
    );

    // Template Variatons
    // For MVP, we'll implement 2 distinct structures and map IDs to them
    // Real implementation would have separate components per template likely

    const isModern = ['modern-slate', 'bold-brand', 'tech-dark'].includes(templateId);
    const isMinimal = ['minimal-white', 'compact-bill'].includes(templateId);

    // Default to Classic if not matched
    const templateClass = isModern ? 'modern-layout' : isMinimal ? 'minimal-layout' : 'classic-layout';

    return (
        <div
            id="invoice-preview"
            className={cn(
                "w-full h-full bg-[var(--bg-color)] text-[var(--text-color)] p-8 shadow-sm transition-all duration-300 origin-top-left",
                className
            )}
            style={style}
        >
            {/* Header Section */}
            <div className={cn(
                "flex justify-between mb-12",
                branding.logoAlignment === 'center' && "flex-col items-center text-center",
                branding.logoAlignment === 'right' && "flex-row-reverse",
                isModern && "border-b-4 border-[var(--primary)] pb-8"
            )}>
                <div>
                    <Logo />
                    <h1 className="text-3xl font-bold text-[var(--primary)] uppercase tracking-tight">{branding.companyName}</h1>
                    <p className="whitespace-pre-line text-sm opacity-80 mt-2">{branding.companyAddress}</p>
                    <p className="text-sm opacity-80 mt-1">{branding.companyContact}</p>
                    {fields.taxId && <p className="text-sm font-semibold mt-2 text-[var(--secondary)]">GSTIN: 29ABCDE1234F1Z5</p>}
                </div>

                <div className={cn(
                    "text-right",
                    branding.logoAlignment === 'center' && "text-center mt-6",
                    branding.logoAlignment === 'right' && "text-left"
                )}>
                    <h2 className="text-4xl font-black text-[var(--accent)] mb-2 uppercase">{layout.type}</h2>
                    <div className="space-y-1">
                        <p className="text-lg"><strong># {data.invoiceNumber}</strong></p>
                        <p className="text-sm opacity-80">Date: {data.date}</p>
                        {fields.dueDate && <p className="text-sm opacity-80">Due Date: {data.dueDate}</p>}
                    </div>
                </div>
            </div>

            {/* Bill To & Details Grid */}
            <div className="flex justify-between gap-8 mb-12">
                <div className="flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)] mb-3 border-b border-[var(--secondary)]/20 pb-1">Bill To</h3>
                    <p className="font-bold text-lg">{data.billTo.company}</p>
                    <p>{data.billTo.name}</p>
                    <p className="whitespace-pre-line text-sm opacity-80 mt-1">{data.billTo.address}</p>
                    {fields.customerTaxId && <p className="text-sm mt-2">Tax ID: {data.billTo.taxId}</p>}
                </div>

                {(fields.poNumber || fields.paymentTerms || fields.projectName) && (
                    <div className="flex-1 text-right">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)] mb-3 border-b border-[var(--secondary)]/20 pb-1">Details</h3>
                        {fields.poNumber && <p className="text-sm"><span className="opacity-60">PO Number:</span> <strong>PO-998877</strong></p>}
                        {fields.projectName && <p className="text-sm"><span className="opacity-60">Project:</span> Website Redesign</p>}
                        {fields.paymentTerms && <p className="text-sm"><span className="opacity-60">Terms:</span> Net 15</p>}
                    </div>
                )}
            </div>

            {/* Items Table */}
            <table className="w-full mb-12">
                <thead className={cn(
                    isModern ? "bg-[var(--primary)] text-white" : "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                )}>
                    <tr>
                        <th className="py-3 px-4 text-left font-bold text-sm">Item</th>
                        <th className="py-3 px-4 text-center font-bold text-sm w-24">Qty</th>
                        <th className="py-3 px-4 text-right font-bold text-sm w-32">Rate</th>
                        <th className="py-3 px-4 text-right font-bold text-sm w-32">Tax</th>
                        <th className="py-3 px-4 text-right font-bold text-sm w-40">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--secondary)]/10">
                    {data.items.map((item) => (
                        <tr key={item.id}>
                            <td className="py-4 px-4">
                                <p className="font-bold">{item.description}</p>
                            </td>
                            <td className="py-4 px-4 text-center">{item.quantity}</td>
                            <td className="py-4 px-4 text-right">{data.currency} {item.unitPrice.toLocaleString()}</td>
                            <td className="py-4 px-4 text-right text-sm opacity-70">{item.taxRate}%</td>
                            <td className="py-4 px-4 text-right font-medium">{data.currency} {item.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end mb-16">
                <div className="w-72 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="opacity-70">Subtotal</span>
                        <span>{data.currency} {data.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="opacity-70">Tax (18%)</span>
                        <span>{data.currency} {data.taxTotal.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-[var(--secondary)]/30 pt-3 flex justify-between text-xl font-bold text-[var(--primary)]">
                        <span>Total</span>
                        <span>{data.currency} {data.grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-8 border-t-2 border-[var(--secondary)]/10 pt-8">
                <div className="text-sm opacity-80 whitespace-pre-line">
                    <h4 className="font-bold mb-2 text-[var(--primary)]">Terms & Conditions</h4>
                    {footer.content}
                </div>
                <div className="text-right space-y-6">
                    {footer.showQrCode && (
                        <div className="flex justify-end">
                            <div className="bg-white p-2 border border-slate-200 inline-block">
                                <QrCode size={64} className="text-slate-800" />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-12 mt-8">
                        {footer.showSignature && (
                            <div className="text-center">
                                <div className="h-16 w-32 border-b border-slate-400 mb-2"></div>
                                <p className="text-xs uppercase font-bold tracking-wider opacity-60">Signature</p>
                            </div>
                        )}
                        {footer.showStamp && (
                            <div className="h-24 w-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-300 uppercase rotate-[-12deg]">
                                Stamp
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
