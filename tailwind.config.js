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
    			display: ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
    			sans: ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
    			serif: ['var(--font-newsreader)', 'Newsreader', 'serif'],
    			mono: ['var(--font-spline-mono)', 'Spline Sans Mono', 'monospace'],
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
    			// Ferbz "ledger" design system — paper/ink/green, from pro/Ferbz Landing.dc.html
    			paper: '#F2EDE3',
    			'paper-alt': '#E9E2D2',
    			'paper-warm': '#E5DDCB',
    			'paper-white': '#FDFBF5',
    			ink: '#17150F',
    			'ink-soft': '#3E3A2E',
    			mutedink: '#6E6753',
    			faint: '#9A927C',
    			green: '#146C3C',
    			'green-bright': '#4ED397',
    			'green-pale': '#D3F2DC',
    			'green-tint': '#CBE8D6',
    			'green-muted': '#A8D8BC',
    			rust: '#C4441C',
    			ember: '#E4572E',
    			terracotta: '#C96A3F',
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
    			},
    			'eb-ticker': {
    				from: { transform: 'translateX(0)' },
    				to: { transform: 'translateX(-50%)' }
    			},
    			'eb-print': {
    				'0%': { transform: 'translateY(-94%)' },
    				'6%': { transform: 'translateY(-94%)' },
    				'42%': { transform: 'translateY(0)' },
    				'88%': { transform: 'translateY(0)' },
    				'94%': { opacity: '1' },
    				'97%': { opacity: '0', transform: 'translateY(0)' },
    				'98%': { opacity: '0', transform: 'translateY(-94%)' },
    				'100%': { opacity: '1', transform: 'translateY(-94%)' }
    			},
    			'eb-bubble': {
    				'0%, 48%': { opacity: '0', transform: 'translateY(14px) scale(.92)' },
    				'55%, 90%': { opacity: '1', transform: 'none' },
    				'95%, 100%': { opacity: '0' }
    			},
    			'eb-stamp': {
    				'0%, 62%': { opacity: '0', transform: 'rotate(-7deg) scale(1.5)' },
    				'68%, 90%': { opacity: '1', transform: 'rotate(-7deg) scale(1)' },
    				'95%, 100%': { opacity: '0' }
    			},
    			'eb-blink': {
    				'0%, 100%': { opacity: '1' },
    				'50%': { opacity: '.2' }
    			},
    			'nav-in': {
    				from: { opacity: '0', transform: 'translateY(-16px)' },
    				to: { opacity: '1', transform: 'translateY(0)' }
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'spin': 'spin 30s linear infinite',
    			'marquee': 'marquee 35s linear infinite',
    			'marquee-reverse': 'marquee-reverse 35s linear infinite',
    			'float-slow': 'float-slow 4s ease-in-out infinite',
    			'eb-ticker': 'eb-ticker 36s linear infinite',
    			'eb-print': 'eb-print 10s cubic-bezier(.3,0,.2,1) infinite',
    			'eb-bubble': 'eb-bubble 10s ease infinite',
    			'eb-stamp': 'eb-stamp 10s ease infinite',
    			'eb-blink': 'eb-blink 1.4s step-end infinite',
    			'nav-in': 'nav-in .5s cubic-bezier(.22,.61,.21,1) both',
    		}
    	}
    },
  plugins: [tailwindcssAnimate, tailwindTypography]
}
