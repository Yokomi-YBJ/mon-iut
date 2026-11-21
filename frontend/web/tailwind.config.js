/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette centralisée extraite directement de l'espace admin existant
        iut: {
          orange: {
            DEFAULT: '#f97616', // Orange officiel du logo
            hover: '#e6660b',   // Hover admin
            dark: '#c2410c',
            light: '#fff7ed',   // Fond subtil sélections / badges
            border: '#fed7aa',
          },
          blue: {
            DEFAULT: '#1e1b4b', // Bleu marine officiel texte IUT
            hover: '#312e81',
            dark: '#0f172a',
            light: '#eef2ff',
            border: '#c7d2fe',
          },
          bg: '#f0f0f0',       // Fond de page admin existant
          surface: '#ffffff',  // Cartes et panneaux
          text: {
            dark: '#333333',   // Texte principal
            grey: '#666666',   // Texte secondaire
            muted: '#94a3b8',
          },
          border: '#dddddd',   // Bordure admin
          danger: {
            DEFAULT: '#dc2626',
            light: '#fee2e2',
            hover: '#b91c1c',
          },
          success: {
            DEFAULT: '#16a34a',
            light: '#dcfce7',
            hover: '#15803d',
          },
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
