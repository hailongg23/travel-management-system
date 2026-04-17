/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'slide-in-right': 'slideInRight 0.6s ease-out forwards',
                'bounce-custom': 'bounce 1s infinite',
                'shimmer': 'shimmer 1.5s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                slideInRight: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                shimmer: {
                    '0%': {
                        'background-position': '-200% 0',
                    },
                    '100%': {
                        'background-position': '200% 0',
                    },
                },
            },
        },
    },
    plugins: [],
}
