import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#F7F4EF',
        card: '#FFFFFF',
        ink: '#1C1A17',
        muted: '#7A7168',
        border: '#E6E0D8',
        accent: '#2A6944',
        'accent-hover': '#245A39',
        'accent-light': '#ECF4EE',
      },
      boxShadow: {
        card: '0 1px 3px rgba(28, 26, 23, 0.06), 0 4px 16px rgba(28, 26, 23, 0.04)',
        'card-hover': '0 2px 8px rgba(28, 26, 23, 0.10), 0 8px 24px rgba(28, 26, 23, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
