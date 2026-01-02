import { useTheme } from '@/lib/context/ThemeContext';

export interface ChartColors {
    primary: string;
    secondary: string;
    tertiary: string;
    grid: string;
    text: string;
    success: string;
    warning: string;
    error: string;
}

export const getChartColors = (theme: 'light' | 'dark'): ChartColors => {
    if (theme === 'dark') {
        return {
            primary: '#14b8a6',              // Brand Teal (Primary)
            secondary: '#8b5cf6',            // Brand Purple (Secondary)
            tertiary: '#06b6d4',             // Cyan
            grid: 'rgba(255,255,255,0.1)',  // Subtle white
            text: '#94A3B8',                 // Slate-400
            success: '#10B981',              // Emerald-500
            warning: '#F59E0B',              // Amber-500
            error: '#EF4444'                 // Red-500
        };
    }

    // Light mode - darker colors for better contrast
    return {
        primary: '#0d9488',                  // Darker Teal for light mode
        secondary: '#7c3aed',                // Darker Purple
        tertiary: '#0891b2',                 // Darker Cyan
        grid: '#E5E7EB',                     // Gray-200
        text: '#6B7280',                     // Gray-500
        success: '#059669',                  // Emerald-600
        warning: '#D97706',                  // Amber-600
        error: '#DC2626'                     // Red-600
    };
};

export const useChartColors = (): ChartColors => {
    const { theme } = useTheme();
    return getChartColors(theme);
};
