import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export default function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    ...props
}: ButtonProps) {
    // Filter out non-motion props if necessary, but spreading props to motion.button usually works if types align.
    // The issue is React.ButtonHTMLAttributes vs HTMLMotionProps.
    // We can cast or be explicit.

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...(props as any)}
        >
            {isLoading ? (
                <span className={styles.loader} />
            ) : (
                <>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    );
}
