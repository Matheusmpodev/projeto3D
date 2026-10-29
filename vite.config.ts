import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

type RegraDeCabecalhos = { source: string; headers: { key: string; value: string }[] }

// O `vite preview` não lê o vercel.json. Pra testar a CSP e os outros cabeçalhos de segurança
// localmente, o preview usa os mesmos, lidos do próprio vercel.json: um lugar só pra editar.
// Só a regra geral ("/(.*)"); as de cache não importam no teste local.
function cabecalhosDeSeguranca(): Record<string, string> {
  const vercel: { headers: RegraDeCabecalhos[] } = JSON.parse(readFileSync('vercel.json', 'utf8'))
  const geral = vercel.headers.find((regra) => regra.source === '/(.*)')
  return Object.fromEntries((geral?.headers ?? []).map(({ key, value }) => [key, value]))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // no `npm run dev` não: o servidor de desenvolvimento usa scripts inline e WebSocket (recarga ao vivo)
  preview: { headers: cabecalhosDeSeguranca() },
})
