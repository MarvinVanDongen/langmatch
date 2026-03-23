/** @type {import('tailwindcss').Config} */
module.exports = {
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
        bg: '#F9F7F4',
        card: '#FFFFFF',
        ink: '#12100E',
        muted: '#6B6560',
        border: '#E8E3DC',
        accent: '#1B4332',
        'accent-hover': '#143326',
        'accent-light': '#D8F3DC',
        'accent-mid': '#52B788',
        gold: '#C9A84C',
        'gold-light': '#FDF3DC',
        dark: '#0D1B2A',
      },
      boxShadow: {
        card: '0 1px 4px rgba(12,10,8,0.06), 0 6px 20px rgba(12,10,8,0.05)',
        'card-hover': '0 4px 12px rgba(12,10,8,0.10), 0 16px 40px rgba(12,10,8,0.08)',
        glow: '0 0 0 3px rgba(82,183,136,0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D1B2A 0%, #1B4332 60%, #2D6A4F 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
      },
    },
  },
  plugins: [],
}
