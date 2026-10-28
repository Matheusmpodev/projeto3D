import { Icone } from './Icone'
import type { NomeDoIcone } from './imagens'

type Props = {
  id?: string // âncora pro menu (ex.: "qualidade-do-ar")
  rotulo: string
  icone: NomeDoIcone
  valor: string
  unidade?: string
  nota: string
}

// Card da seção AGORA/: rótulo pequeno, ícone, valor grande e uma nota curta em verde-limão.
export function CardClima({ id, rotulo, icone, valor, unidade, nota }: Props) {
  return (
    <article id={id} className="card-clima borda-pixel">
      <h3 className="card-rotulo">{rotulo}</h3>
      <Icone nome={icone} tamanho={40} />
      <p className="card-valor">
        {valor}
        {unidade && <span className="card-unidade">{unidade}</span>}
      </p>
      <p className="card-nota">{nota}</p>
    </article>
  )
}
