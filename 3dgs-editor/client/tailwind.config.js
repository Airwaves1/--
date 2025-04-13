export default {
  content: ["./src/​**​/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 扩展暗色主题
        'gray-900': '#1a1a1a',
        'gray-800': '#252526',
        'gray-700': '#3d3d3d',
        'gray-600': '#454545',
        // 主题色
        'blue-400': '#2196F3',
        'green-400': '#4CAF50',
        'purple-400': '#9C27B0'
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem'
      }
    },
  },
  plugins: [
    (await import('@tailwindcss/line-clamp')).default,
    (await import('tailwind-scrollbar')).default
  ],
}