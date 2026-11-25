/** Color treatments taken verbatim from the original design. Sizing stays in `className`. */
export const BUTTON_VARIANTS = {
  primary: 'bg-brand hover:bg-brand-2 text-ink font-extrabold',
  secondary: 'bg-card hover:bg-card-hover border border-zinc-600 text-white',
  yellow: 'bg-brand hover:bg-brand-2 text-ink font-extrabold',
  dark: 'bg-black hover:bg-zinc-900 text-white font-extrabold border border-zinc-700',
  ghost: 'text-zinc-300 hover:text-white',
} as const;
