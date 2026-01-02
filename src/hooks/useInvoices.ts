import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
    setCustomer,
    updateInvoiceMetadata,
    addItemToInvoice,
    updateInvoiceItem,
    removeInvoiceItem,
    saveInvoice,
    resetCurrentInvoice,
    InvoiceItem,
    Invoice
} from '@/lib/store/features/invoiceSlice';

export function useInvoices() {
    const dispatch = useAppDispatch();
    const { invoices, currentInvoice } = useAppSelector((state) => state.invoice);

    return {
        invoices,
        currentInvoice,
        isLoaded: true, // Mock loaded state
        setCustomer: (name: string) => dispatch(setCustomer(name)),
        updateMetadata: (data: Partial<Invoice>) => dispatch(updateInvoiceMetadata(data)),
        addItem: (item: InvoiceItem) => dispatch(addItemToInvoice(item)),
        updateItem: (id: string, qty: number) => dispatch(updateInvoiceItem({ id, quantity: qty })),
        removeItem: (id: string) => dispatch(removeInvoiceItem(id)),
        saveInvoice: () => dispatch(saveInvoice()),
        resetInvoice: () => dispatch(resetCurrentInvoice())
    };
}
