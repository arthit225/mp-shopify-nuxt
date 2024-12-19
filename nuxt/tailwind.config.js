module.exports = {
  content: ['./storyblok/**/*.{js,vue,ts}'],
  theme: {
    extend: {
      colors: {
        'mp-cream': 'var(--mp-cream)',
        'mp-coral': 'var(--mp-coral)',
        'mp-mauve': 'var(--mp-mauve)',
        'mp-brown': 'var(--mp-brown)',
        'mp-grey': 'var(--mp-grey)',
        'mp-gray': 'var(--mp-gray)',
        'mp-gray-2': 'var(--mp-gray-2)',
        'mp-off-white': 'var(--mp-off-white)',
        'mp-color-text-secondary': 'var(--mp-color-text-secondary)'
      },
      screens: {
        '2xl-down': {'max': '1535px'},
        'xl-down': {'max': '1279px'},
        'lg-down': {'max': '1023px'},
        'md-down': {'max': '767px'},
        'sm-down': {'max': '639px'}
      },
    },
  },
  plugins: [],
};
