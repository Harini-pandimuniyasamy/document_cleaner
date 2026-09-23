import React, { ButtonHTMLAttributes, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-xl font-bold gap-1.5',
    md: 'px-6 py-3 text-sm rounded-xl font-bold gap-2',
    lg: 'px-8 py-4 text-base rounded-2xl font-extrabold gap-2.5',
  };

  const variantClasses = {
    primary:
      'primary-btn text-white shadow-lg shadow-indigo-900/25 hover:shadow-indigo-600/40 cursor-pointer border border-white/20',
    secondary: 'secondary-btn cursor-pointer',
    ghost: 'bg-transparent text-slate-700 hover:bg-white/60 hover:text-indigo-900 cursor-pointer',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer',
  };

  // Subtle Magnetic Hover Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Cap magnetic delta to max 6px
    const deltaX = Math.max(-6, Math.min(6, (e.clientX - centerX) * 0.15));
    const deltaY = Math.max(-6, Math.min(6, (e.clientY - centerY) * 0.15));
    setTransform({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  // Ripple effect on click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      setRipples((prev) => [...prev.slice(-3), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={buttonRef}
      disabled={disabled || isLoading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: transform.x === 0 && transform.y === 0 ? 'transform 0.25s ease-out' : 'none',
      }}
      className={`relative overflow-hidden inline-flex items-center justify-center select-none active:scale-[0.98] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Click ripple shockwave animations */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-cyan-300/40 pointer-events-none animate-ping duration-500"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}

      {isLoading ? (
        <div className="relative w-4 h-4 mr-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/30 border-t-cyan-300 animate-spin" />
          <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
        </div>
      ) : (
        leftIcon
      )}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
