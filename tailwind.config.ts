import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: 'hsl(217, 91%, 60%)', // #2563EB
          foreground: 'hsl(0, 0%, 100%)', // White text on primary
          dark: 'hsl(220, 71%, 47%)', // #1E40AF
          light: 'hsl(214, 100%, 95%)', // #DBEAFE
        },
        secondary: {
          DEFAULT: 'hsl(22, 93%, 54%)', // #F97316
          foreground: 'hsl(0, 0%, 100%)', // White text on secondary
          light: 'hsl(33, 100%, 88%)', // #FFEDD5
          pale: 'hsl(40, 100%, 94%)', // #FEF3E2
        },

        // Accent Colors
        accent: {
          DEFAULT: 'hsl(160, 84%, 39%)', // #059669 - Success Green
          foreground: 'hsl(0, 0%, 100%)',
          secondary: 'hsl(43, 96%, 57%)', // #FBBF24 - Attention Yellow
        },

        // Gradient Colors
        gradient: {
          start: 'hsl(217, 91%, 60%)', // #2563EB
          end: 'hsl(271, 70%, 58%)', // #7C3AED
        },

        // Semantic Colors
        success: 'hsl(142, 76%, 36%)', // #10B981
        warning: 'hsl(38, 92%, 50%)', // #F59E0B
        error: 'hsl(0, 72%, 51%)', // #EF4444
        info: 'hsl(217, 91%, 60%)', // #3B82F6

        // Neutral Scale
        neutral: {
          50: 'hsl(210, 20%, 98%)', // #F9FAFB
          100: 'hsl(220, 14%, 96%)', // #F3F4F6
          200: 'hsl(220, 13%, 91%)', // #E5E7EB
          300: 'hsl(216, 12%, 84%)', // #D1D5DB
          400: 'hsl(218, 11%, 65%)', // #9CA3AF
          500: 'hsl(220, 9%, 46%)', // #6B7280
          600: 'hsl(215, 14%, 34%)', // #4B5563
          700: 'hsl(217, 19%, 27%)', // #374151
          800: 'hsl(215, 28%, 17%)', // #1F2937
          900: 'hsl(221, 39%, 11%)', // #111827
        },

        // Semantic UI colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Destructive
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Muted
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Popover
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Card
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },

      fontSize: {
        // Mobile-first type scale
        'xs': ['0.75rem', { lineHeight: '1.125rem' }], // 12px/18px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px/20px
        'base': ['0.9375rem', { lineHeight: '1.375rem' }], // 15px/22px mobile, 16px/24px desktop
        'lg': ['1.0625rem', { lineHeight: '1.625rem' }], // 17px/26px mobile, 18px/28px desktop
        'xl': ['1.125rem', { lineHeight: '1.625rem' }], // 18px/26px mobile, 20px/28px desktop
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px/28px mobile, 24px/32px desktop
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }], // 28px/36px mobile, 36px/44px desktop
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }], // 36px/44px mobile, 48px/56px desktop
      },

      spacing: {
        // 8px base unit system
        '0.5': '0.25rem', // 4px
        '1': '0.5rem', // 8px
        '2': '1rem', // 16px
        '3': '1.5rem', // 24px
        '4': '2rem', // 32px
        '6': '3rem', // 48px
        '8': '4rem', // 64px
      },

      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },

      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'slide-down': 'slide-down 300ms ease-out',
        'pulse': 'pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
