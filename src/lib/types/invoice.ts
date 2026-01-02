export type InvoiceType = 'standard' | 'tax' | 'proforma';
export type PageFormat = 'a4' | 'letter' | 'a5';
export type PageOrientation = 'portrait' | 'landscape';
export type TemplateCategory = 'modern' | 'minimal' | 'professional' | 'creative' | 'bold';

export interface InvoiceTemplate {
    id: string;
    name: string;
    category: TemplateCategory;
    thumbnail: string; // URL or path
    description: string;
    isPremium?: boolean;
}

export interface TemplateCustomization {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string; // Hex or preset name
        text: string;
    };
    fonts: {
        heading: string;
        body: string;
        sizeScale: number; // 0.8 to 1.2
    };
    branding: {
        logo?: string; // Data URL or path
        logoSize: 'small' | 'medium' | 'large';
        logoAlignment: 'left' | 'center' | 'right';
        companyName: string;
        companyAddress: string;
        companyContact: string; // Phone/Email
        showLogo: boolean;
    };
    layout: {
        type: InvoiceType;
        format: PageFormat;
        orientation: PageOrientation;
    };
    fields: {
        taxId: boolean; // GSTIN
        customerTaxId: boolean;
        poNumber: boolean;
        projectName: boolean;
        deliveryDate: boolean;
        paymentTerms: boolean;
        dueDate: boolean;
    };
    footer: {
        content: string; // Payment details, Thank you note
        showSignature: boolean;
        showStamp: boolean;
        showQrCode: boolean;
    };
}

// Sample Invoice Data for Preview
export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    amount: number;
}

export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    billTo: {
        name: string;
        company: string;
        address: string;
        taxId?: string;
    };
    items: InvoiceLineItem[];
    subtotal: number;
    taxTotal: number;
    grandTotal: number;
    currency: string;
    notes?: string;
}
