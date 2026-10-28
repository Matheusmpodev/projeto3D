import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fontes servidas pelo próprio site (Fontsource), só os pesos usados no CSS. Cada arquivo traz
// todos os alfabetos com unicode-range: o navegador baixa só os que aparecem na página (latin).
// Antes vinham do Google Fonts, cujo CSS bloqueava o início do JavaScript até responder
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/pixelify-sans/500.css'
import '@fontsource/pixelify-sans/600.css'
import './index.css'
import App from './App.tsx'

// ao recarregar, o navegador não devolve o scroll antigo: a abertura sempre começa na entrada
history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
