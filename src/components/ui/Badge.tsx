
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'default';
}

const getVariantClasses = (variant: BadgeProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80';
    case 'secondary':
      return 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80';
    case 'destructive':
      return 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80';
    case 'success':
      return 'border-transparent bg-green-500 text-white hover:bg-green-500/80';
    case 'warning':
       return 'border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80';
    default:
      return 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80';
  }
};

// Fix: Refactored component to destructure props inside the function body.
// This resolves a TypeScript issue where the `variant` prop's type was being
// incorrectly widened to `string` when destructured in the function signature.
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (props, ref) => {
    const { className, variant = 'default', ...rest } = props;
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
    const variantClasses = getVariantClasses(variant);
    
    return (
      <div
        className={`${baseClasses} ${variantClasses} ${className || ''}`}
        ref={ref}
        {...rest}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
