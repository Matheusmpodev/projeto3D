import type { Clima, IconeDoTempo } from '../tipos'

// BASE_URL respeita o "base" do vite.config (se o site for publicado numa subpasta)
const PASTA = `${import.meta.env.BASE_URL}clima/`

export type NomeDoIcone = IconeDoTempo | 'folha' | 'gota' | 'vento' | 'uv' | 'termometro'

export const urlDoIcone = (nome: NomeDoIcone) => `${PASTA}icone-${nome}.svg`
export const fundoDoClima = (clima: Clima) => `${PASTA}fundo-${clima}.png`

// ícone grande do card ao vivo para cada clima (à noite, a lua)
export const ICONE_DO_CLIMA: Record<Clima, IconeDoTempo> = { sol: 'sol', chuva: 'chuva', neve: 'neve', noite: 'lua' }
