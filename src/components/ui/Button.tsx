import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-midnight-950 disabled:opacity-50 disabled:pointer-events-none rounded-control',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-purple text-text-primary hover:bg-accent-purple/90 shadow-glow font-semibold',
        glass:
          'bg-surface-glass text-text-primary border border-surface-border hover:border-surface-border-hover hover:bg-surface-glass/80 backdrop-blur-glass',
        cyan:
          'bg-accent-cyan text-midnight-950 font-semibold hover:bg-accent-cyan/90 shadow-glow-cyan',
        outline:
          'border border-surface-border text-text-secondary hover:text-text-primary hover:border-surface-border-hover',
        ghost:
          'text-text-secondary hover:text-text-primary hover:bg-surface-glass/40',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base font-semibold',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
