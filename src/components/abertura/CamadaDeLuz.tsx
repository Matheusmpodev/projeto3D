import type { RefObject } from 'react'
import './abertura.css'

type Props = {
  ref: RefObject<HTMLDivElement | null>
  saindo: boolean // site aberto: a camada some com fade, revelando o conteúdo
}

// Camada creme por cima do canvas: a "luz da porta" que cobre a tela no fim do corredor.
// No corredor, a opacidade é escrita direto no estilo pelo TransicaoDaPorta, a cada quadro.
// Ao abrir o site, a classe .saindo faz o fade até 0 (ver abertura.css).
export function CamadaDeLuz({ ref, saindo }: Props) {
  return <div ref={ref} className={saindo ? 'camada-luz saindo' : 'camada-luz'} aria-hidden="true" />
}
