import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '390px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        midnight: {
          950: 'var(--bg-midnight-950)',
          900: 'var(--bg-midnight-900)',
        },
        surface: {
          glass: 'var(--surface-glass)',
          border: 'var(--border-glass)',
          'border-hover': 'var(--border-glass-hover)',
        },
        accent: {
          purple: 'var(--accent-neon-purple)',
          cyan: 'var(--accent-cyber-cyan)',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        container: 'var(--radius-container)',
        control: 'var(--radius-control)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        glow: 'var(--glow-purple)',
        'glow-cyan': 'var(--glow-cyan)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
