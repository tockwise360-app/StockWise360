import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { closeAddProductModal, addItem, InventoryItem } from '@/lib/store/features/inventorySlice';
import { Modal } from '@/components/ui/Modal';
import { Step1General } from './add-product/Step1General';
import { Step2Pricing } from './add-product/Step2Pricing';
import { Step3Stock } from './add-product/Step3Stock';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const INITIAL_DATA: Partial<InventoryItem> = {
    name: '',
    sku: '',
    category: '',
    status: 'In Stock',
    stockLevel: 0,
    minStock: 10,
    maxStock: 100,
    unitPrice: 0,
    costPrice: 0,
    leadTime: 1,
    unit: 'pcs',
    history: [],
    autoReorder: true,
    location: ['Warehouse A'],
    turnoverRate: 'Medium',
    minOrderQuantity: 10,
    reorderPoint: 15
};

export function AddProductModal() {
    const dispatch = useAppDispatch();
    const { isAddProductOpen } = useAppSelector(state => state.inventory);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<InventoryItem>>(INITIAL_DATA);

    const handleClose = () => {
        dispatch(closeAddProductModal());
        setStep(1);
        setFormData(INITIAL_DATA);
    };

    const updateFormData = (data: Partial<InventoryItem>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        // Final validation and defaults
        const newItem: InventoryItem = {
            ...formData,
            id: `INV-${Date.now()}`,
            lastUpdated: new Date().toISOString(),
            // Ensure status is correct based on stock
            status: formData.stockLevel === 0 ? 'Out of Stock' : (formData.stockLevel! <= formData.minStock! ? 'Low Stock' : 'In Stock')
        } as InventoryItem;

        dispatch(addItem(newItem));
        handleClose();
    };

    const isStepValid = () => {
        if (step === 1) return formData.name && formData.sku && formData.category;
        if (step === 2) return formData.unitPrice && formData.unitPrice > 0;
        if (step === 3) return formData.stockLevel !== undefined;
        return false;
    };

    return (
        <Modal
            isOpen={isAddProductOpen}
            onClose={handleClose}
            title="Add New Product"
            className="max-w-2xl"
        >
            <div className="flex flex-col h-[500px]">
                {/* Stepper */}
                <div className="flex items-center justify-between px-10 mb-8 relative">
                    {/* Line */}
                    <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-white/10 -z-10" />

                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 bg-white dark:bg-[#1e1e24] px-2">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all
                                ${step >= s ? 'bg-brand-teal border-brand-teal text-white' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}
                             `}>
                                {step > s ? <Check size={14} /> : s}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s ? 'text-brand-teal' : 'text-slate-400'}`}>
                                {s === 1 ? 'General' : s === 2 ? 'Pricing' : 'Stock'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto px-1 py-2 custom-scrollbar">
                    {step === 1 && <Step1General formData={formData} onChange={updateFormData} />}
                    {step === 2 && <Step2Pricing formData={formData} onChange={updateFormData} />}
                    {step === 3 && <Step3Stock formData={formData} onChange={updateFormData} />}
                </div>

                {/* Footer */}
                <div className="flex justify-between pt-6 mt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`
                            px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors
                            ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-400'}
                        `}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className="px-8 py-3 bg-brand-teal hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                        >
                            Next Step <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-brand-teal hover:bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-95 animate-pulse"
                        >
                            Create Product <Check size={16} />
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
