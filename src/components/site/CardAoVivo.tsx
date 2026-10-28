import type { RefObject } from 'react'
import { BuscaCidade } from './BuscaCidade'
import { Icone } from './Icone'
import { ICONE_DO_CLIMA } from './imagens'
import { dataEHora, graus } from './formatacao'
import type { DadosDoClima } from './tipos'

type Props = {
  dados: DadosDoClima
  tituloRef: RefObject<HTMLHeadingElement | null> // recebe o foco quando o site abre
}

// Card central do hero: o clima de agora na cidade.
export function CardAoVivo({ dados, tituloRef }: Props) {
  return (
    <section className="card-ao-vivo borda-pixel" aria-labelledby="titulo-ao-vivo">
      <h1 id="titulo-ao-vivo" ref={tituloRef} tabIndex={-1} className="ao-vivo-rotulo">
        <span className="ao-vivo-ponto" aria-hidden="true">
          ■
        </span>{' '}
        AO VIVO · {dados.cidade.toUpperCase()}
      </h1>
      <p className="ao-vivo-data">{dataEHora(dados.atualizadoEm)}</p>

      <div className="ao-vivo-principal">
        <Icone nome={ICONE_DO_CLIMA[dados.clima]} tamanho={96} />
        <p className="ao-vivo-temperatura">{graus(dados.temperatura)}</p>
      </div>
      <p className="ao-vivo-condicao">{dados.condicao}</p>

      <dl className="ao-vivo-faixa">
        <div>
          <dt>Máx</dt>
          <dd>{graus(dados.maxima)}</dd>
        </div>
        <div>
          <dt>Mín</dt>
          <dd>{graus(dados.minima)}</dd>
        </div>
        <div>
          <dt>Sensação</dt>
          <dd>{graus(dados.sensacao)}</dd>
        </div>
      </dl>

      <BuscaCidade />
    </section>
  )
}
