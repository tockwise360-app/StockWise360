'use client';

import React from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceRenderer } from '@/components/invoices/templates/InvoiceRenderer';
import { InvoiceData } from '@/lib/types/invoice';

interface InvoicePreviewProps {
    templateCustomization: {
        selectedTemplateId: string;
        customization: any;
    };
}

export function InvoicePreview({ templateCustomization }: InvoicePreviewProps) {
    const { currentInvoice } = useInvoices();
    const { selectedTemplateId, customization } = templateCustomization;

    // Map the current invoice data to the InvoiceData format expected by InvoiceRenderer
    const invoiceData: InvoiceData = {
        invoiceNumber: currentInvoice.invoiceNumber,
        date: currentInvoice.date,
        dueDate: currentInvoice.dueDate,
        billTo: {
            name: currentInvoice.customerName || 'Customer Name',
            company: currentInvoice.customerName || 'Company Name',
            address: currentInvoice.customerAddress || '123 Customer Street, City, State 12345',
            taxId: '27ABCDE1234F1Z5',
        },
        items: currentInvoice.items.length > 0 ? currentInvoice.items.map(item => ({
            id: item.id,
            description: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: currentInvoice.taxRate,
            amount: item.total,
        })) : [
            { id: '1', description: 'Sample Product', quantity: 1, unitPrice: 1000, taxRate: 18, amount: 1000 },
            { id: '2', description: 'Another Item', quantity: 2, unitPrice: 500, taxRate: 18, amount: 1000 },
        ],
        subtotal: currentInvoice.subtotal || 2000,
        taxTotal: currentInvoice.tax || 360,
        grandTotal: currentInvoice.total || 2360,
        currency: '₹',
    };

    return (
        <div
            className="bg-white shadow-2xl origin-top"
            style={{
                width: '210mm',
                minHeight: '297mm',
                boxShadow: '0 10px 50px rgba(0,0,0,0.15)'
            }}
        >
            <InvoiceRenderer
                templateId={selectedTemplateId}
                customization={customization}
                data={invoiceData}
            />
        </div>
    );
}
