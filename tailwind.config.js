/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        // ── Foundation (~80% of UI) ──
        bg: '#080B11',              // vault-ink — deep background
        'vault-ink': '#080B11',
        surface: '#10161F',         // graphite-navy — primary surface
        'graphite-navy': '#10161F',
        'surface-high': '#1A2230',  // slate-steel — elevated surface
        'slate-steel': '#1A2230',
        border: '#3A3220',          // bronze-hairline — borders & separators
        'bronze-hairline': '#3A3220',

        // ── Gold system (~15% — prefer the gradient, flat refined-gold only for tiny marks) ──
        champagne: '#EFDBA0',       // active edges, key metrics, hover, hero reflections
        'refined-gold': '#C7A23A',  // logo, primary icons, section markers, key headlines
        'antique-bronze': '#8A6A1E',// shadows, gradient depth transitions
        accent: '#C7A23A',          // flat gold fallback = refined-gold
        'accent-soft': 'rgba(199,162,58,0.13)',

        // ── Text (never pure white) ──
        'text-primary': '#F4F1E8',  // warm ivory
        'text-secondary': '#A7AAB0',// stone
        'text-muted': '#7A7F88',    // muted slate — metadata

        // ── Accents (strict, minimal usage) ──
        'accent-teal': '#3E96B3',   // MAX ONE per viewport: ROI / compliance / AI metric
        'accent-cool': '#3E96B3',   // legacy alias → teal
        'accent-sage': '#6FA877',   // success states
        'accent-copper': '#B57A44', // ROI / financial / board-level callouts

        // ── Helix material (now gold) ──
        'helix-glow': '#C7A23A',
      },
      fontFamily: {
        fraunces: ['var(--font-fraunces)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    }
  },
  plugins: []
};
