export function themeScript(storageKey: string) {
  return `
      (function() {
        function getTheme() {
          const storedTheme = localStorage.getItem('${storageKey}');
          if (storedTheme) {
            return storedTheme;
          }
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
  
        const theme = getTheme();
        document.documentElement.classList.add(theme);
      })();
    `;
}
