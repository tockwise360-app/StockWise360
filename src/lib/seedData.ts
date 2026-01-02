import { Product, BusinessType } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createProduct = (
    name: string,
    category: string,
    price: number,
    stock: number,
    businessType: BusinessType,
    attributes: Record<string, any> = {},
    expiryDate?: string
): Product => ({
    id: generateId(),
    name,
    category,
    price,
    cost: Math.round(price * 0.7), // Assume 30% margin
    stock,
    gstRate: 18,
    businessType,
    attributes,
    expiryDate,
    lowStockThreshold: 10
});

export const SEED_DATA: Product[] = [
    // 1. Mobile Shop
    createProduct('iPhone 15 Case - Clear', 'Accessories', 999, 50, 'Mobile Shop', { model: 'iPhone 15' }),
    createProduct('Samsung S24 Screen Guard', 'Accessories', 499, 100, 'Mobile Shop', { model: 'S24' }),
    createProduct('USB-C Fast Charger 20W', 'Chargers', 1299, 30, 'Mobile Shop', { watts: 20 }),
    createProduct('AirPods Pro Case', 'Accessories', 599, 25, 'Mobile Shop'),
    createProduct('Power Bank 10000mAh', 'Power', 1999, 15, 'Mobile Shop'),
    createProduct('Lightning Cable 1m', 'Cables', 399, 80, 'Mobile Shop'),
    createProduct('Bluetooth Neckband', 'Audio', 1499, 20, 'Mobile Shop'),
    createProduct('Mobile Stand', 'Accessories', 299, 40, 'Mobile Shop'),
    createProduct('OTG Adapter Type-C', 'Adapters', 150, 60, 'Mobile Shop'),
    createProduct('Selfie Stick', 'Accessories', 699, 10, 'Mobile Shop'),

    // 2. Hardware - Electronics
    createProduct('Resistor Kit (500pcs)', 'Components', 299, 20, 'Hardware - Electronics'),
    createProduct('Arduino Uno R3', 'Microcontrollers', 1499, 15, 'Hardware - Electronics'),
    createProduct('Soldering Iron 25W', 'Tools', 450, 10, 'Hardware - Electronics'),
    createProduct('Multimeter Digital', 'Tools', 899, 8, 'Hardware - Electronics'),
    createProduct('LED 5mm Red (Pack of 100)', 'Components', 150, 50, 'Hardware - Electronics'),
    createProduct('Breadboard 830 Points', 'Prototyping', 250, 30, 'Hardware - Electronics'),
    createProduct('Jumper Wires (M-M)', 'Cables', 120, 40, 'Hardware - Electronics'),
    createProduct('9V Battery', 'Power', 45, 100, 'Hardware - Electronics'),
    createProduct('DC Motor 12V', 'Motors', 350, 25, 'Hardware - Electronics'),
    createProduct('Raspberry Pi 4', 'Microcomputers', 4500, 5, 'Hardware - Electronics'),

    // 3. Hardware - Plumbing
    createProduct('PVC Pipe 1 inch (10ft)', 'Pipes', 350, 100, 'Hardware - Plumbing', { size: '1 inch' }),
    createProduct('Elbow Joint 90 deg', 'Fittings', 45, 200, 'Hardware - Plumbing'),
    createProduct('Teflon Tape', 'Consumables', 25, 150, 'Hardware - Plumbing'),
    createProduct('Water Tap - Steel', 'Fixtures', 650, 40, 'Hardware - Plumbing'),
    createProduct('Gate Valve 1 inch', 'Valves', 450, 30, 'Hardware - Plumbing'),
    createProduct('Shower Head', 'Fixtures', 899, 20, 'Hardware - Plumbing'),
    createProduct('Pipe Wrench 12"', 'Tools', 550, 10, 'Hardware - Plumbing'),
    createProduct('Solvent Cement 100ml', 'Adhesives', 120, 50, 'Hardware - Plumbing'),
    createProduct('Ball Valve', 'Valves', 350, 45, 'Hardware - Plumbing'),
    createProduct('Coupling 1 inch', 'Fittings', 30, 180, 'Hardware - Plumbing'),

    // 4. Pharmacy
    createProduct('Paracetamol 500mg', 'Medicine', 20, 500, 'Pharmacy', {}, '2026-12-31'),
    createProduct('Cough Syrup 100ml', 'Medicine', 120, 50, 'Pharmacy', {}, '2025-06-30'),
    createProduct('Vitamin C Tablets', 'Supplements', 150, 80, 'Pharmacy', {}, '2025-10-15'),
    createProduct('Bandage Roll', 'First Aid', 40, 100, 'Pharmacy'),
    createProduct('Antiseptic Liquid 500ml', 'First Aid', 250, 30, 'Pharmacy'),
    createProduct('Face Mask N95', 'Protection', 99, 200, 'Pharmacy'),
    createProduct('Thermometer Digital', 'Equipment', 350, 15, 'Pharmacy'),
    createProduct('Pain Relief Gel', 'Medicine', 180, 40, 'Pharmacy', {}, '2026-01-20'),
    createProduct('Diabetes Test Strips', 'Equipment', 850, 20, 'Pharmacy', {}, '2025-08-01'),
    createProduct('Hand Sanitizer 100ml', 'Hygiene', 50, 120, 'Pharmacy'),

    // 5. Bike Accessories
    createProduct('Studds Helmet Full Face', 'Safety', 1800, 15, 'Bike Accessories', { size: 'L' }),
    createProduct('LED Fog Lights (Pair)', 'Lights', 1200, 10, 'Bike Accessories'),
    createProduct('Bike Cover Waterproof', 'Protection', 450, 25, 'Bike Accessories'),
    createProduct('Chain Lube Spray', 'Maintenance', 350, 40, 'Bike Accessories'),
    createProduct('Mobile Holder Metal', 'Accessories', 650, 20, 'Bike Accessories'),
    createProduct('Riding Gloves', 'Safety', 899, 15, 'Bike Accessories', { size: 'M' }),
    createProduct('Disc Brake Lock', 'Security', 750, 12, 'Bike Accessories'),
    createProduct('Tank Pad Sticker', 'Aesthetics', 250, 50, 'Bike Accessories'),
    createProduct('Bungee Cords', 'Utility', 150, 60, 'Bike Accessories'),
    createProduct('Puncture Kit Tubeless', 'Maintenance', 300, 30, 'Bike Accessories'),

    // 6. Car Accessories
    createProduct('Car Floor Mats (Set)', 'Interior', 1500, 10, 'Car Accessories'),
    createProduct('Microfiber Cloth', 'Cleaning', 199, 100, 'Car Accessories'),
    createProduct('Car Air Freshener', 'Interior', 250, 50, 'Car Accessories'),
    createProduct('Dash Cam 1080p', 'Electronics', 4500, 5, 'Car Accessories'),
    createProduct('Steering Wheel Cover', 'Interior', 499, 20, 'Car Accessories'),
    createProduct('Tyre Inflator Portable', 'Tools', 1800, 8, 'Car Accessories'),
    createProduct('Car Vacuum Cleaner', 'Cleaning', 1200, 12, 'Car Accessories'),
    createProduct('Neck Pillow', 'Comfort', 350, 30, 'Car Accessories'),
    createProduct('Sun Shade (Set of 4)', 'Protection', 400, 25, 'Car Accessories'),
    createProduct('Aux Cable', 'Audio', 150, 40, 'Car Accessories'),

    // 7. Car Repair Workshop
    createProduct('Engine Oil 5W-30 (4L)', 'Fluids', 2500, 20, 'Car Repair'),
    createProduct('Oil Filter', 'Parts', 350, 30, 'Car Repair'),
    createProduct('Brake Pads (Front)', 'Parts', 1800, 15, 'Car Repair'),
    createProduct('Spark Plug', 'Parts', 250, 50, 'Car Repair'),
    createProduct('Coolant 1L', 'Fluids', 300, 40, 'Car Repair'),
    createProduct('Wiper Blades (Pair)', 'Parts', 600, 25, 'Car Repair'),
    createProduct('Battery 35Ah', 'Parts', 4500, 5, 'Car Repair'),
    createProduct('Clutch Plate', 'Parts', 3500, 8, 'Car Repair'),
    createProduct('Headlight Bulb H4', 'Parts', 250, 60, 'Car Repair'),
    createProduct('Labor - General Service', 'Service', 1500, 999, 'Car Repair'),

    // 8. Bike Repair Workshop
    createProduct('Engine Oil 10W-40 (1L)', 'Fluids', 450, 50, 'Bike Repair'),
    createProduct('Chain Sprocket Kit', 'Parts', 1200, 15, 'Bike Repair'),
    createProduct('Brake Shoe', 'Parts', 250, 40, 'Bike Repair'),
    createProduct('Clutch Cable', 'Parts', 150, 30, 'Bike Repair'),
    createProduct('Air Filter', 'Parts', 180, 25, 'Bike Repair'),
    createProduct('Spark Plug', 'Parts', 120, 60, 'Bike Repair'),
    createProduct('Battery 4Ah', 'Parts', 1100, 10, 'Bike Repair'),
    createProduct('Tube 2.75-18', 'Tyres', 350, 20, 'Bike Repair'),
    createProduct('Indicator Light', 'Parts', 150, 40, 'Bike Repair'),
    createProduct('Labor - General Service', 'Service', 450, 999, 'Bike Repair'),

    // 9. Grocery Shop
    createProduct('Rice Basmati 5kg', 'Grains', 650, 50, 'Grocery', {}, '2025-12-01'),
    createProduct('Wheat Flour 10kg', 'Flour', 450, 40, 'Grocery', {}, '2025-03-01'),
    createProduct('Sugar 1kg', 'Essentials', 45, 100, 'Grocery'),
    createProduct('Sunflower Oil 1L', 'Oil', 160, 60, 'Grocery', {}, '2025-06-01'),
    createProduct('Toor Dal 1kg', 'Pulses', 140, 50, 'Grocery'),
    createProduct('Milk 500ml', 'Dairy', 30, 20, 'Grocery', {}, '2024-11-30'),
    createProduct('Bread Loaf', 'Bakery', 40, 15, 'Grocery', {}, '2024-11-29'),
    createProduct('Eggs (Dozen)', 'Dairy', 80, 30, 'Grocery', {}, '2024-12-05'),
    createProduct('Tea Powder 250g', 'Beverages', 120, 40, 'Grocery'),
    createProduct('Salt 1kg', 'Essentials', 20, 100, 'Grocery'),

    // 10. Supermarket
    createProduct('Detergent Powder 3kg', 'Household', 450, 50, 'Supermarket'),
    createProduct('Dishwash Liquid 1L', 'Household', 180, 40, 'Supermarket'),
    createProduct('Shampoo 650ml', 'Personal Care', 550, 30, 'Supermarket'),
    createProduct('Toothpaste 150g', 'Personal Care', 90, 60, 'Supermarket'),
    createProduct('Biscuits Pack', 'Snacks', 30, 100, 'Supermarket'),
    createProduct('Instant Noodles 6-Pack', 'Snacks', 80, 80, 'Supermarket'),
    createProduct('Soft Drink 2L', 'Beverages', 90, 50, 'Supermarket'),
    createProduct('Chocolate Bar', 'Snacks', 50, 150, 'Supermarket'),
    createProduct('Frozen Peas 1kg', 'Frozen', 180, 20, 'Supermarket'),
    createProduct('Ketchup 1kg', 'Condiments', 140, 30, 'Supermarket'),
];
