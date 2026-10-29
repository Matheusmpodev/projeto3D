import { Icone } from './Icone'
import type { NomeDoIcone } from '../lib/imagens'

type Props = {
  id?: string // âncora pro menu (ex.: "qualidade-do-ar")
  rotulo: string
  icone: NomeDoIcone
  valor?: string // sem valor = carregando (mostra esqueleto)
  unidade?: string
  nota?: string
}

// Card da seção AGORA/: rótulo pequeno, ícone, valor grande e uma nota curta em verde-limão.
// Enquanto carrega, rótulo e ícone já aparecem e o valor e a nota viram blocos de esqueleto.
export function CardClima({ id, rotulo, icone, valor, unidade, nota }: Props) {
  const carregando = valor === undefined

  return (
    <article id={id} className="card-clima borda-pixel" aria-busy={carregando}>
      <h3 className="card-rotulo">{rotulo}</h3>
      <Icone nome={icone} tamanho={40} />
      {carregando ? (
        <>
          <span className="esqueleto" style={{ width: '55%', height: '2.4rem' }} />
          <span className="esqueleto" style={{ width: '80%', height: '0.8rem' }} />
        </>
      ) : (
        <>
          <p className="card-valor">
            {valor}
            {unidade && <span className="card-unidade">{unidade}</span>}
          </p>
          <p className="card-nota">{nota}</p>
        </>
      )}
    </article>
  )
}
