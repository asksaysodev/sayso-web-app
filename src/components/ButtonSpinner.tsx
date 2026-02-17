interface ButtonSpinnerProps {
    color?: string;
    size?: number;
}

export default function ButtonSpinner({ color = 'white', size = 14 }: ButtonSpinnerProps) {
    return (
        <div 
            style={{
                width: `${size}px`,
                height: `${size}px`,
                border: `2px solid ${color}33`,
                borderTop: `2px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
            }}
        />
    );
}
