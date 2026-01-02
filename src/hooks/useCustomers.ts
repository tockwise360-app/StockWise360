import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setSelectedCustomer,
    updateCreditUsage,
    Customer
} from '@/lib/store/features/customerSlice';

export function useCustomers() {
    const dispatch = useAppDispatch();
    const { customers, selectedCustomerId } = useAppSelector((state) => state.customer);

    const selectedCustomer = selectedCustomerId
        ? customers.find(c => c.id === selectedCustomerId)
        : null;

    return {
        customers,
        selectedCustomer,
        addCustomer: (data: Customer) => dispatch(addCustomer(data)),
        updateCustomer: (data: Customer) => dispatch(updateCustomer(data)),
        deleteCustomer: (id: string) => dispatch(deleteCustomer(id)),
        selectCustomer: (id: string | null) => dispatch(setSelectedCustomer(id)),
        updateCredit: (id: string, amount: number, type: 'increase' | 'decrease') =>
            dispatch(updateCreditUsage({ id, amount, type }))
    };
}
