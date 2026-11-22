/** Color treatments taken verbatim from the original design. Sizing stays in `className`. */
export const BUTTON_VARIANTS = {
  primary:
    'bg-gradient-to-r from-yellow-300 via-lime-300 to-lime-400 hover:from-yellow-200 hover:to-lime-300 text-black font-extrabold',
  secondary: 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-zinc-600 text-white',
  yellow: 'bg-yellow-300 hover:bg-yellow-200 text-black font-extrabold',
  dark: 'bg-black hover:bg-zinc-900 text-white font-extrabold border border-zinc-700',
  ghost: 'text-zinc-300 hover:text-white',
} as const;
