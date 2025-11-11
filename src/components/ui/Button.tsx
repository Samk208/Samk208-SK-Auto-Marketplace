import React from 'react';

const getVariantClasses = (variant: ButtonProps['variant'], outline: boolean) => {
  if (outline) {
    switch (variant) {
      case 'primary': return 'border border-primary text-primary bg-transparent shadow-sm hover:bg-primary/10';
      case 'secondary': return 'border border-secondary-foreground/20 text-secondary-foreground bg-transparent shadow-sm hover:bg-secondary/80';
      case 'destructive': return 'border border-destructive text-destructive bg-transparent shadow-sm hover:bg-destructive/10';
      case 'ghost': return 'hover:bg-accent hover:text-accent-foreground';
      case 'link': return 'text-primary underline-offset-4 hover:underline';
      default: return 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground';
    }
  }
  
  switch (variant) {
    case 'primary': return 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
    case 'secondary': return 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80';
    case 'destructive': return 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90';
    case 'ghost': return 'hover:bg-accent hover:text-accent-foreground';
    case 'link': return 'text-primary underline-offset-4 hover:underline';
    default: return 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
  }
};

const getSizeClasses = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm': return 'h-8 rounded-md px-3 text-xs';
    case 'lg': return 'h-10 rounded-md px-8';
    case 'icon': return 'h-9 w-9';
    default: return 'h-9 px-4 py-2';
  }
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'default';
  size?: 'sm' | 'lg' | 'icon' | 'default';
  outline?: boolean;
}

// Fix: Refactored component to destructure props inside the function body.
// This resolves a TypeScript issue where `variant` and `size` types were being
// incorrectly widened to `string` when destructured in the function signature.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, variant = 'default', size = 'default', outline = false, ...rest } = props;
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
    const variantClasses = getVariantClasses(variant, outline);
    const sizeClasses = getSizeClasses(size);

    return (
      <button
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`}
        ref={ref}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };