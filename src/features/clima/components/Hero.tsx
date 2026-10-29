import type { ReactNode } from 'react'
import { fundoDoClima } from '../lib/imagens'
import type { Clima } from '../tipos'

// Moldura do topo: paisagem pixel art do clima atual, com um degradê embaixo que funde com o
// fundo da página. O conteúdo (menu e card) vem como children.
export function Hero({ clima, children }: { clima: Clima; children: ReactNode }) {
  return (
    <div className="hero">
      <img className="hero-fundo" src={fundoDoClima(clima)} alt="" />
      <div className="hero-conteudo">{children}</div>
    </div>
  )
}
