/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ghana Government Brand Colors - Matching Frontend
        'ghana': {
          // Primary Brand Colors - Professional Government Blues
          'primary': {
            50: '#eff6ff',   // Very light blue
            100: '#dbeafe',  // Light blue
            200: '#bfdbfe',  // Lighter blue
            300: '#93c5fd',  // Light medium blue
            400: '#60a5fa',  // Medium light blue
            500: '#3b82f6',  // Medium blue
            600: '#1d4ed8',  // GSFP Blue (primary)
            700: '#1e40af',  // Darker blue
            800: '#1e3a8a',  // Dark blue (headers)
            900: '#1e293b',  // Very dark blue (navbars)
          },
          // Secondary Colors - Ghana Flag Inspired Greens
          'secondary': {
            50: '#f0fdf4',   // Very light green
            100: '#dcfce7',  // Light green
            200: '#bbf7d0',  // Lighter green
            300: '#86efac',  // Light medium green
            400: '#4ade80',  // Medium light green
            500: '#22c55e',  // Medium green
            600: '#059669',  // GSFP Green (accent/CTAs)
            700: '#047857',  // Dark green
            800: '#065f46',  // Darker green
            900: '#064e3b',  // Very dark green
          },
          // Gold Colors - Ghana Flag Inspired Gold
          'gold': {
            50: '#fefce8',   // Very light gold
            100: '#fef9c3',  // Light gold
            200: '#fef08a',  // Lighter gold
            300: '#fde047',  // Light medium gold
            400: '#facc15',  // Medium light gold
            500: '#eab308',  // Medium gold
            600: '#ca8a04',  // GSFP Gold (text/highlights)
            700: '#a16207',  // Dark gold
            800: '#854d0e',  // Darker gold
            900: '#713f12',  // Very dark gold
          },
          // Warning Colors - Amber/Orange for warnings
          'warning': {
            50: '#fffbeb',   // Very light amber
            100: '#fef3c7',  // Light amber
            200: '#fde68a',  // Lighter amber
            300: '#fcd34d',  // Light medium amber
            400: '#fbbf24',  // Medium light amber
            500: '#f59e0b',  // Medium amber
            600: '#d97706',  // GSFP Warning (warnings/alerts)
            700: '#b45309',  // Dark amber
            800: '#92400e',  // Darker amber
            900: '#78350f',  // Very dark amber
          },
          // Error Colors - Red for errors
          'error': {
            50: '#fef2f2',   // Very light red
            100: '#fee2e2',  // Light red
            200: '#fecaca',  // Lighter red
            300: '#fca5a5',  // Light medium red
            400: '#f87171',  // Medium light red
            500: '#ef4444',  // Medium red
            600: '#dc2626',  // GSFP Error (errors/danger)
            700: '#b91c1c',  // Dark red
            800: '#991b1b',  // Darker red
            900: '#7f1d1d',  // Very dark red
          },
          // Neutral Colors - Professional Grays
          'neutral': {
            50: '#f8fafc',   // Very light gray
            100: '#f1f5f9',  // Light gray
            200: '#e2e8f0',  // Lighter gray
            300: '#cbd5e1',  // Light medium gray
            400: '#94a3b8',  // Medium light gray
            500: '#64748b',  // Medium gray
            600: '#475569',  // GSFP Gray (text)
            700: '#334155',  // Dark gray
            800: '#1e293b',  // Darker gray
            900: '#0f172a',  // Very dark gray
          },
          // Status Colors
          'success': '#059669',    // Green for success
          'warning': '#d97706',    // Amber for warnings
          'error': '#dc2626',      // Red for errors
          'info': '#1d4ed8',       // Blue for info
        },
        // Legacy support - map to new Ghana colors
        'brand': {
          'primary': '#1d4ed8',     // GSFP Blue
          'secondary': '#059669',   // GSFP Green
          'accent': '#059669',      // GSFP Green
          'neutral': '#475569',     // GSFP Gray
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.12)',
        'large': '0 8px 40px 0 rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
