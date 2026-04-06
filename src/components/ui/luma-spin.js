"use client";

export function LumaSpin({ size = 65 }) {
    return (
        <div
            style={{
                position: 'relative',
                width: `${size}px`,
                aspectRatio: '1 / 1',
                display: 'inline-block',
            }}
        >
            <style>{`
                @keyframes loaderAnim {
                    0%    { inset: 0 ${size*0.538}px ${size*0.538}px 0; }
                    12.5% { inset: 0 ${size*0.538}px 0 0; }
                    25%   { inset: ${size*0.538}px ${size*0.538}px 0 0; }
                    37.5% { inset: ${size*0.538}px 0 0 0; }
                    50%   { inset: ${size*0.538}px 0 0 ${size*0.538}px; }
                    62.5% { inset: 0 0 0 ${size*0.538}px; }
                    75%   { inset: 0 0 ${size*0.538}px ${size*0.538}px; }
                    87.5% { inset: 0 0 ${size*0.538}px 0; }
                    100%  { inset: 0 ${size*0.538}px ${size*0.538}px 0; }
                }
                .luma-span {
                    position: absolute;
                    border-radius: 50px;
                    animation: loaderAnim 2.5s infinite;
                    box-shadow: inset 0 0 0 3px var(--primary-color, #6d28d9);
                }
                .luma-span-delayed {
                    animation-delay: -1.25s;
                }
            `}</style>
            <span className="luma-span" />
            <span className="luma-span luma-span-delayed" />
        </div>
    );
}
