/* eslint-disable react/prop-types */
import React from 'react';

type Sizes = 'small' | 'medium' | 'large';
const getSize = (size: Sizes) => {
    const widths: Record<Sizes, React.CSSProperties> = {
        small: {
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            borderRadius: '2px',
        },
        medium: {
            padding: '.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
        },
        large: {
            padding: '1rem 2rem',
            fontSize: '1.25rem',
            borderRadius: '6px',
        },
    };
    return widths[size];
};

type Colors = 'light' | 'dark';
const getColor = (color: Colors) => {
    const colors: Record<Colors, React.CSSProperties> = {
        dark: {
            backgroundColor: 'var(--primary-800)',
            color: 'white',
            border: 'none',
        },
        light: {
            backgroundColor: 'white',
            color: 'var(--primary-800)',
            border: '.5px solid var(--primary-800)',
        },
    };
    return colors[color];
};

const baseStyles: React.CSSProperties = {
    outline: '0',
    cursor: 'pointer',
};

type ButtonProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: any;
    size?: Sizes;
    color?: Colors;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
};

export function Button({
    as = 'button',
    size = 'medium',
    color = 'light',
    ...rest
}: ButtonProps): JSX.Element {
    // Using regular styles here for simplicity
    const Component = as;
    const styles = {
        ...baseStyles,
        ...getSize(size),
        ...getColor(color),
    };

    return <Component style={styles} {...rest} />;
}
