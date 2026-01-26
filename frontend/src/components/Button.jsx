import { useRef } from 'react';
import { gsap } from 'gsap';

function Button({
    children,
    onClick,
    variant = 'primary',
    type = 'button',
    disabled = false,
    fullWidth = false,
    size = 'md',
    className = ''
}) {
    const btnRef = useRef();

    const handleMouseEnter = () => {
        if (!disabled) {
            gsap.to(btnRef.current, {
                scale: 1.02,
                duration: 0.2,
                ease: 'power2.out'
            });
        }
    };

    const handleMouseLeave = () => {
        gsap.to(btnRef.current, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    };

    return (
        <button
            ref={btnRef}
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
