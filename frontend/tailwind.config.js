/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#191919',
          card: '#2d2d2d',
          darker: '#1a1a1a',
          border: '#444',
        },
        accent: {
          DEFAULT: '#ff6300',
          secondary: '#ff8c42',
          hover: '#f4500f',
        }
      },
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
        gaming: ['"Press Start 2P"', 'system-ui'],
        display: ['Audiowide', 'cursive'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(to right, rgba(255, 126, 0, 0.76), #ff6300)',
        'card-gradient': 'linear-gradient(145deg, #252525 0%, #1a1a1a 100%)',
        'overlay-gradient': 'linear-gradient(to top, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0))',
      },
      animation: {
        'dropdown-fade': 'dropdownFadeIn 0.2s ease',
        'modal-fade': 'fadeIn 0.3s ease',
        'modal-slide': 'slideDown 0.4s ease forwards',
        'toast-slide': 'slideIn 0.3s ease, fadeOut 0.3s ease 2.7s',
      },
      keyframes: {
        dropdownFadeIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translate(-50%, calc(-50% - 50px))' },
          'to': { opacity: '1', transform: 'translate(-50%, -50%)' },
        },
        slideIn: {
          'from': { transform: 'translateX(400px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
