/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#14b8a6", // Teal-500
                secondary: "#0ea5e9", // Sky-500
                accent: "#8b5cf6", // Violet-500
                background: "#f0f9ff", // Sky-50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
