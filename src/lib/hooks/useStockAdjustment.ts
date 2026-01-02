import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/lib/store/hooks';
import { adjustStock, closeAdjustmentModal, InventoryItem, undoLastAdjustment } from '@/lib/store/features/inventorySlice';
import { useToast } from '@/lib/context/ToastContext';

const adjustmentSchema = z.object({
    amount: z.number()
        .int("Quantity must be a whole number")
        .positive("Quantity must be greater than 0")
        .max(99999, "Quantity cannot exceed 99,999"),
    type: z.enum(['add', 'remove', 'set']),
    reason: z.string().min(1, "Please select a reason"),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

export function useStockAdjustment(item: InventoryItem | undefined) {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AdjustmentFormData>({
        resolver: zodResolver(adjustmentSchema),
        defaultValues: {
            amount: 0,
            type: 'add',
            reason: '',
            notes: '',
        },
        mode: 'onBlur',
    });

    // Real-time calculation for preview
    const watchAmount = form.watch('amount');
    const watchType = form.watch('type');

    const currentStock = item?.stockLevel || 0;
    let newStock = currentStock;
    let adjustmentValue = 0;

    if (watchAmount) {
        if (watchType === 'add') {
            newStock = currentStock + watchAmount;
            adjustmentValue = watchAmount;
        } else if (watchType === 'remove') {
            newStock = currentStock - watchAmount;
            adjustmentValue = -watchAmount;
        } else if (watchType === 'set') {
            newStock = watchAmount;
            adjustmentValue = watchAmount - currentStock;
        }
    }

    const onSubmit = async (data: AdjustmentFormData) => {
        if (!item) return;

        setIsSubmitting(true);

        // Simulate network delay for "Saving..." state
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            dispatch(adjustStock({
                id: item.id,
                amount: data.amount,
                type: data.type,
                reason: data.reason,
                notes: data.notes
            }));
            dispatch(closeAdjustmentModal());

            showToast(
                `Stock adjusted successfully. ${data.type === 'set' ? 'Set to' : (data.type === 'add' ? 'Added' : 'Removed')} ${data.amount}.`,
                'success',
                () => {
                    dispatch(undoLastAdjustment());
                    showToast('Stock adjustment undone.', 'info');
                }
            );
        } catch (error) {
            showToast('Failed to adjust stock. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
            form.reset();
        }
    };

    return {
        form,
        isSubmitting,
        preview: {
            currentStock,
            newStock,
            adjustmentValue,
            willBeNegative: newStock < 0,
            isLargeAdjustment: Math.abs(adjustmentValue) > (currentStock * 0.5) && currentStock > 0
        },
        onSubmit: form.handleSubmit(onSubmit),
    };
}
