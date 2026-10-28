import type { CSSProperties, RefObject } from 'react'
import './abertura.css'

const PIXEL = 3 // px por "pixel" dos ícones

// Desenho em pixel art como texto: cada X vira uma sombra de 1 pixel (box-shadow) com a cor do
// texto. O elemento em si é 1 pixel transparente; as sombras formam o desenho ao redor dele.
function desenhar(linhas: string[]): CSSProperties {
  const sombras = linhas.flatMap((linha, y) =>
    [...linha].flatMap((c, x) => (c === 'X' ? [`${x * PIXEL}px ${y * PIXEL}px 0 0 currentColor`] : [])),
  )
  return { width: PIXEL, height: PIXEL, boxShadow: sombras.join(', ') }
}

// contorno do mouse; a rodinha é outro elemento, que a animação mexe
const MOUSE = desenhar([
  '.XXXXXX.',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  'X......X',
  '.XXXXXX.',
])
const RODINHA = desenhar(['XX', 'XX', 'XX'])

// mão apontando pra cima
const DEDO = desenhar([
  '...XX....',
  '...XX....',
  '...XX....',
  '...XXXXX.',
  '.X.XXXXXX',
  '.XXXXXXXX',
  '.XXXXXXXX',
  '..XXXXXXX',
  '..XXXXXX.',
  '...XXXXX.',
])

// Instrução no início do corredor. Fica sempre montada durante o corredor, mas invisível; quem
// liga e desliga a classe .visivel é o ControleDaInstrucao (dentro do Canvas), pelo progresso.
// Computador ou celular é escolhido só no CSS, por @media (pointer: coarse).
export function InstrucaoDoCorredor({ ref }: { ref: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ref} className="instrucao">
      <p className="instrucao-texto">Atravesse o corredor e veja o clima lá fora.</p>

      <p className="instrucao-dica so-mouse">
        <span className="icone-mouse" aria-hidden="true">
          <span style={MOUSE} />
          <span className="icone-mouse-rodinha" style={RODINHA} />
        </span>
        <span>
          Role para andar <span aria-hidden="true">↓</span>
        </span>
      </p>

      <p className="instrucao-dica so-toque">
        <span className="icone-dedo" aria-hidden="true">
          <span style={DEDO} />
        </span>
        <span>
          Deslize para andar <span aria-hidden="true">↑</span>
        </span>
      </p>
    </div>
  )
}
