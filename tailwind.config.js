const withAnimations = require('animated-tailwindcss');
module.exports = withAnimations({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/screens/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/components/shared/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundColor: {
        almostblack: '#302c2f',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary-hover))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        mainBlue: '#00a3fe',
        mainCyan: 'rgba(45, 158, 190, 0.2)',
        mainBlack: '#323232',
        mainWhite: '#F5F3F2',
        mainOrange: '#F69225',
        mainGray: '#65666D',
        mainRed: '#E30E0E',
        mainGreen: '#007337',
      },
      boxShadow: {
        card: '0px 4px 10px rgba(0, 0, 0, 0.02), 0px 10px 22px rgba(0, 0, 0, 0.02)',
        pricingCard: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
      },
      // lineHeight: {
      //   'extra-loose': '2.5',
      //   '12': '3rem',
      // },
      fontSize: {
        // xs: '.75rem',
        // sm: '.85rem',
        // tiny: '95rem',

        // base: '1.15rem',
        // lg: '1.45rem',
        // xl: '1.75rem',

        // '2xl': '2rem',
        // '3xl': '2.5rem',
        // '4xl': '3rem',

        // '6xl': '6.5rem',
        // '7xl': '7.5rem',
        // '8xl': '8.5rem',
        xs: '.75rem',
        sm: '.875rem',
        tiny: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.75rem',
        '2xl': '2.25rem',
        '3xl': '2.75rem',
        '4xl': '3.5rem',
        '5xl': '4rem',
        '6xl': '4.75rem',
        '7xl': '6rem',
        '8xl': '7.5rem',

        a1: '.75rem',
        a2: '.90rem',
        a3: '1rem',

        b1: '1.50rem',
        b2: '1.50rem',
        b3: '1.75rem',

        c1: '2rem',
        c2: '2.5rem',
        c3: '3rem',

        d1: '6.5rem',
        d2: '7.5rem',
        d3: '8.5rem',

        // '9xl': '10rem',
      },
    },
  },
  safelist: [
    {
      pattern: /(bg|text|border)-main(Black|Blue|White|Orange|Gray|Red|Green|Cyan)/,
    },
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
});
