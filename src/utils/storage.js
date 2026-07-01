export const getStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
export const setStore = (key, value) => localStorage.setItem(key, JSON.stringify(value))
export const uid = () => Math.random().toString(36).slice(2, 10)
