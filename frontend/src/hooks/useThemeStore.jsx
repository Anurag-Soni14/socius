import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('web-theme') || 'dark',
  setTheme: (theme)=> {
    localStorage.setItem('web-theme', theme);
    set({theme});
  }
}))