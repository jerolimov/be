module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: '#666',
            // color: theme('colors.sky.300'),
            a: {
              fontWeight: theme('fontWeight.semibold'),
              textDecoration: 'none',
              borderBottom: `1px solid ${theme('colors.sky.300')}`,
            },
            'a:hover': {
              borderBottomWidth: '2px',
            },
          },
        },
      }),
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
