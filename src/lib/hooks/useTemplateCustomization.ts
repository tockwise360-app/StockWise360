import { useState, useEffect, useCallback } from 'react';
import { InvoiceTemplate, TemplateCustomization, InvoiceData } from '@/lib/types/invoice';

const DEFAULT_CUSTOMIZATION: TemplateCustomization = {
    colors: {
        primary: '#0f172a', // Slate 900
        secondary: '#64748b', // Slate 500
        accent: '#0ea5e9', // Sky 500
        background: '#ffffff',
        text: '#1e293b',
    },
    fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizeScale: 1,
    },
    branding: {
        companyName: 'StockWise Inc.',
        companyAddress: '123 Business Park, Tech City, TC 560001',
        companyContact: 'contact@stockwise.com | +91 98765 43210',
        logoSize: 'medium',
        logoAlignment: 'left',
        showLogo: true,
    },
    layout: {
        type: 'tax',
        format: 'a4',
        orientation: 'portrait',
    },
    fields: {
        taxId: true,
        customerTaxId: true,
        poNumber: true,
        projectName: false,
        deliveryDate: false,
        paymentTerms: true,
        dueDate: true,
    },
    footer: {
        content: 'Bank: HDFC Bank\nAccount: 1234567890\nIFSC: HDFC0001234\n\nThank you for your business!',
        showSignature: true,
        showStamp: false,
        showQrCode: true,
    },
};

const MOCK_INVOICE_DATA: InvoiceData = {
    invoiceNumber: 'INV-2024-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    billTo: {
        name: 'John Doe',
        company: 'Acme Corp',
        address: '456 Client Road, Innovation Park, Mumbai, MH 400001',
        taxId: '27ABCDE1234F1Z5',
    },
    items: [
        { id: '1', description: 'Web Development Services', quantity: 1, unitPrice: 25000, taxRate: 18, amount: 25000 },
        { id: '2', description: 'Hosting (Annual)', quantity: 1, unitPrice: 5000, taxRate: 18, amount: 5000 },
        { id: '3', description: 'Domain Registration', quantity: 2, unitPrice: 1000, taxRate: 18, amount: 2000 },
    ],
    subtotal: 32000,
    taxTotal: 5760,
    grandTotal: 37760,
    currency: '₹',
};

// Mock Templates
export const AVAILABLE_TEMPLATES: InvoiceTemplate[] = [
    { id: 'modern-slate', name: 'Modern Slate', category: 'modern', thumbnail: '/templates/modern-slate.png', description: 'Clean and professional with sharp typography.' },
    { id: 'minimal-white', name: 'Minimal White', category: 'minimal', thumbnail: '/templates/minimal-white.png', description: 'Simple and elegant, perfect for freelancers.' },
    { id: 'bold-brand', name: 'Bold Brand', category: 'bold', thumbnail: '/templates/bold-brand.png', description: 'High impact design that highlights your brand color.' },
    { id: 'classic-serif', name: 'Classic Serif', category: 'professional', thumbnail: '/templates/classic-serif.png', description: 'Traditional layout with trustworthy serif fonts.' },
    { id: 'tech-dark', name: 'Tech Dark', category: 'creative', thumbnail: '/templates/tech-dark.png', description: 'Dark mode inspired design for tech companies.' },
    { id: 'compact-bill', name: 'Compact Bill', category: 'minimal', thumbnail: '/templates/compact-bill.png', description: 'Optimized for printing on smaller receipts.' },
    { id: 'corporate-blue', name: 'Corporate Blue', category: 'professional', thumbnail: '/templates/corporate-blue.png', description: 'Standard corporate style with structured sections.' },
    { id: 'creative-studio', name: 'Creative Studio', category: 'creative', thumbnail: '/templates/creative-studio.png', description: 'Artistic layout for design agencies.' },
];

export interface SavedTemplate {
    id: string;
    name: string;
    templateId: string;
    customization: TemplateCustomization;
    lastModified: number;
}

export function useTemplateCustomization() {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('modern-slate');
    const [customization, setCustomization] = useState<TemplateCustomization>(DEFAULT_CUSTOMIZATION);
    const [previewScale, setPreviewScale] = useState(1);
    const [previewData] = useState<InvoiceData>(MOCK_INVOICE_DATA);

    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('invoice-template-config');
        const savedList = localStorage.getItem('invoice-saved-templates');

        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                if (parsed.templateId) setSelectedTemplateId(parsed.templateId);
                if (parsed.customization) setCustomization(parsed.customization);
            } catch (e) { console.error('Failed to load config', e); }
        }

        if (savedList) {
            try {
                setSavedTemplates(JSON.parse(savedList));
            } catch (e) { console.error('Failed to load saved templates', e); }
        }
    }, []);

    // Save current config state
    useEffect(() => {
        localStorage.setItem('invoice-template-config', JSON.stringify({
            templateId: selectedTemplateId,
            customization,
        }));
    }, [selectedTemplateId, customization]);

    // Save list state
    useEffect(() => {
        localStorage.setItem('invoice-saved-templates', JSON.stringify(savedTemplates));
    }, [savedTemplates]);

    const updateCustomization = useCallback((section: keyof TemplateCustomization, updates: Partial<any>) => {
        setCustomization(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...updates
            }
        }));
    }, []);

    const saveTemplate = useCallback((name: string) => {
        const newTemplate: SavedTemplate = {
            id: Math.random().toString(36).substring(7),
            name,
            templateId: selectedTemplateId,
            customization: JSON.parse(JSON.stringify(customization)), // Deep copy
            lastModified: Date.now(),
        };
        setSavedTemplates(prev => [newTemplate, ...prev]);
        return newTemplate;
    }, [selectedTemplateId, customization]);

    const loadSavedTemplate = useCallback((saved: SavedTemplate) => {
        setSelectedTemplateId(saved.templateId);
        setCustomization(saved.customization);
    }, []);

    const deleteTemplate = useCallback((id: string) => {
        setSavedTemplates(prev => prev.filter(t => t.id !== id));
    }, []);

    const resetCustomization = useCallback(() => {
        setCustomization(DEFAULT_CUSTOMIZATION);
    }, []);

    return {
        selectedTemplateId,
        setSelectedTemplateId,
        customization,
        updateCustomization,
        resetCustomization,
        previewScale,
        setPreviewScale,
        previewData,
        templates: AVAILABLE_TEMPLATES,
        savedTemplates,
        saveTemplate,
        loadSavedTemplate,
        deleteTemplate
    };
}
