import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';
import { FIELD_BASE, FIELD_ERROR, FIELD_LABEL } from './fieldStyles';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  /** Extra content positioned relative to the input (e.g. a suggestions list). */
  children?: ReactNode;
}

/** Labelled text input with optional leading icon and error text. */
export function Input({ label, icon, error, className, id, children, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className={FIELD_LABEL}>
        {label}
      </label>
      <div className={icon || children ? 'relative' : undefined}>
        {icon}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_BASE, icon ? 'pl-10 pr-4' : 'px-4')}
          {...rest}
        />
        {children}
      </div>
      {error && (
        <p id={errorId} className={FIELD_ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}
