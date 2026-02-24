import type { Config } from 'tailwindcss'

export default <Config>{
    darkMode: 'class',
    content: [
        './app/components/**/*.{js,vue,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app/**/*.{vue,ts,js}',
        './app.vue',
        './error.vue'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['PP Neue Montreal', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: '#FFC000',
                    foreground: '#000000',
                },
                accent: {
                    DEFAULT: '#FFC000',
                    foreground: '#000000',
                },
                brand: {
                    DEFAULT: '#FFC000',
                    50: '#FFFBEB',
                    100: '#FFF3C4',
                    200: '#FFE588',
                    300: '#FFD43B',
                    400: '#FFC000',
                    500: '#FFAB00',
                    600: '#E6940A',
                    700: '#CC7A02',
                    800: '#B36508',
                    900: '#8A4F0C',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: '6px',
                md: '4px',
                sm: '2px',
            },
            aspectRatio: {
                '15/8': '15 / 8',
            },
            animation: {
                shimmer: 'shimmer 2s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    from: {
                        'background-position': '0 0',
                    },
                    to: {
                        'background-position': '-200% 0',
                    },
                },
            },
        },
    },
    plugins: [],
}