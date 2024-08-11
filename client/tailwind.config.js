/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx}",
	],
	theme: {
		screens: {
			xs: '360px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		fontFamily: {
			'sans': ['Manrope']
		},
		extend: {
			colors: {
				mainColor: '#fcd34d', 
				light: '#f4f4f5', 
				darkColor: '#f59e0b',
				darkModeMainColor: '#18181b', 
				darkModeSecColor: '#27272a',
				secColor: '#2f1a2f',
				textColor: '#52525b', 
				secTxtColor: '#a1a1aa', 
				placeholderTextColor: '#a1a1aa',
				bgInput: '#f1f5f9',
				bgColor: '#27272a', 
				hoverColor: '#3f3f46',
				semiLight: '#d4d4d8', 
			},
			backgroundImage: {
				'bgLogin': 'url(/bg.jpg)',
			},
			animation: {
				progress: 'progress 1s infinite linear',
			},
			keyframes: {
				progress: {
					'0%': { transform: ' translateX(0) scaleX(0)' },
					'40%': { transform: 'translateX(0) scaleX(0.4)' },
					'100%': { transform: 'translateX(100%) scaleX(0.5)' },
				},
			},
			transformOrigin: {
				'left-right': '0% 50%',
			}
		},
	},
	plugins: [],
}
