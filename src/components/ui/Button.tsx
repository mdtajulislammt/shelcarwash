import type { ButtonHTMLAttributes } from 'react';
import { BUTTON_VARIANTS as VARIANTS } from './buttonVariants';
import { cn } from './cn';

export type ButtonVariant = keyof typeof VARIANTS;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cn(VARIANTS[variant], className)} {...rest} />;
}
