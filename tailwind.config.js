import tailwindcssAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      "./app/**/*.{ts,tsx,js,jsx}",
      "./components/**/*.{ts,tsx,js,jsx}",
      "./lib/**/*.{ts,tsx,js,jsx}",
      "./src/**/*.{html,ts,tsx,js,jsx}"
    ],
	theme: {
    	extend: {
    		fontFamily: {
    			display: ['var(--font-ibm-plex)', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
    			sans: ['var(--font-ibm-plex)', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			brand: {
    				primary: '#F59E0B',
    				primaryDark: '#D97706',
    				primaryMuted: '#78350F',
    				dark: '#09090B',
    				surface: '#18181B',
    				surfaceElevated: '#1C1C1F',
    				border: '#27272A',
    				borderSubtle: '#3F3F46',
    			},
    		},
    		borderColor: {
    			border: 'hsl(var(--border))'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'spin': {
    				from: { transform: 'rotate(0deg)' },
    				to: { transform: 'rotate(360deg)' }
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'spin': 'spin 30s linear infinite',
    			'marquee': 'marquee 35s linear infinite',
    			'marquee-reverse': 'marquee-reverse 35s linear infinite',
    			'float-slow': 'float-slow 4s ease-in-out infinite',
    		}
    	}
    },
  plugins: [tailwindcssAnimate, tailwindTypography]
}
