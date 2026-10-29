import { usePercentualCarregado } from '../../lib/carregamento'
import './abertura.css'

const BLOCOS = 20 // a barra enche em degraus de 5%, como em pixel art, em vez de deslizar

// Cobre o corredor enquanto a cena.glb carrega. Quando ela fica pronta, some com fade (CSS) e
// continua montada, invisível e sem receber cliques, até a fase do site começar.
export function TelaDeCarregamento({ pronta }: { pronta: boolean }) {
  const carregado = usePercentualCarregado()
  const percentual = pronta ? 100 : carregado
  const cheios = Math.floor((percentual / 100) * BLOCOS)

  return (
    <div className={pronta ? 'carregamento pronta' : 'carregamento'} aria-hidden={pronta}>
      <p className="carregamento-nome">PIXELCLIMA</p>
      <div
        className="carregamento-barra borda-pixel"
        role="progressbar"
        aria-label="Carregando o corredor"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentual}
      >
        {Array.from({ length: BLOCOS }, (_, i) => (
          <span key={i} className={i < cheios ? 'cheio' : undefined} />
        ))}
      </div>
      <p className="carregamento-numero">{percentual}%</p>
    </div>
  )
}
