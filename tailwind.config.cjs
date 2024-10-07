/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
	ux: {
		themes: {
			light: {
				'color-scheme': 'light',
				primary: 'hsl(0 0% 5.098%)',
				secondary: 'hsl(0 1.9608% 10%)',
				accent: 'hsl(0 0% 14.902%)',
				neutral: 'hsl(0 0% 0%)',
				info: 'hsl(186.3996 64.5332% 61.9566%)',
				success: 'hsl(156.3531 98.7858% 70.4206%)',
				warning: 'hsl(40.5761 100% 70.509%)',
				danger: 'hsl(7.4376 100% 75.3917%)',
				'surface-100': 'hsl(180 100% 100%)',
				'surface-200': 'hsl(0 0% 94.902%)',
				'surface-300': 'hsl(0 1.9608% 90%)'
			}
		}
	},
  plugins: []
}