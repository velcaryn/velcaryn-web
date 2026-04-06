export function Skeleton({ className = '', style = {}, ...props }) {
    return (
        <div
            className={`skeleton-pulse ${className}`}
            style={{
                background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '8px',
                ...style,
            }}
            {...props}
        />
    );
}
