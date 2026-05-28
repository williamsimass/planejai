// provider do tema claro/escuro
// aprendi Context API nessa aula e achei muito útil

import { type PropsWithChildren, useEffect, useState } from 'react'

import { type Theme, ThemeContext } from './ThemeContext'

export function ThemeProvider({ children }: PropsWithChildren) {
  // inicializa o tema com uma função lazy pra só rodar uma vez
  // ordem de prioridade: localStorage > preferência do SO > claro
  const [theme, setTheme] = useState<Theme>(() => {
    const localStorageTheme = localStorage.getItem('theme') as Theme | null

    // se o usuário já escolheu um tema antes, usa ele
    if (localStorageTheme) {
      return localStorageTheme
    }

    // senão verifica se o sistema operacional está em modo escuro
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    return systemPrefersDark ? 'dark' : 'light'
  })

  // toda vez que o tema mudar, atualiza o atributo no <html>
  // é o data-theme que o CSS usa pra saber qual cor aplicar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    // salva no localStorage pra lembrar na próxima visita
    localStorage.setItem('theme', theme)
  }, [theme])

  // alterna entre claro e escuro
  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    // passa o tema e a função de toggle pra todos os filhos
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
