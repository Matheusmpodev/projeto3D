import type { RefObject } from 'react'
import { BuscaCidade } from './BuscaCidade'
import { Icone } from './Icone'
import { dataEHora, graus } from './formatacao'
import type { DadosDoClima, Lugar } from './tipos'

type Props = {
  lugar: Lugar | null // null enquanto espera a geolocalização
  dados: DadosDoClima | null
  erro: string | null
  onTentarDeNovo: () => void
  onEscolherLugar: (lugar: Lugar) => void
  tituloRef: RefObject<HTMLHeadingElement | null> // recebe o foco quando o site abre
}

// Card central do hero: o clima de agora. Mostra esqueleto enquanto carrega e uma mensagem
// com "Tentar de novo" se der erro; a busca funciona em qualquer um dos estados.
export function CardAoVivo({ lugar, dados, erro, onTentarDeNovo, onEscolherLugar, tituloRef }: Props) {
  const nome = dados?.cidade ?? lugar?.nome
  const carregando = !dados && !erro

  return (
    <section className="card-ao-vivo borda-pixel" aria-labelledby="titulo-ao-vivo" aria-busy={carregando}>
      <h1 id="titulo-ao-vivo" ref={tituloRef} tabIndex={-1} className="ao-vivo-rotulo">
        <span className="ao-vivo-ponto" aria-hidden="true">
          ■
        </span>{' '}
        {nome ? `AO VIVO · ${nome.toUpperCase()}` : 'PROCURANDO VOCÊ…'}
      </h1>

      {dados ? (
        <>
          <p className="ao-vivo-data">{dataEHora(dados.atualizadoEm)}</p>
          <div className="ao-vivo-principal">
            <Icone nome={dados.icone} tamanho={96} />
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
        </>
      ) : erro ? (
        <div className="ao-vivo-erro" role="alert">
          <p>{erro}</p>
          <button type="button" className="botao-limao" onClick={onTentarDeNovo}>
            Tentar de novo
          </button>
        </div>
      ) : (
        <div className="ao-vivo-esqueleto" aria-hidden="true">
          <span className="esqueleto" style={{ width: '60%', height: '0.9rem' }} />
          <span className="esqueleto" style={{ width: '70%', height: '6rem' }} />
          <span className="esqueleto" style={{ width: '45%', height: '1.4rem' }} />
          <span className="esqueleto" style={{ width: '85%', height: '1.2rem' }} />
        </div>
      )}

      <BuscaCidade onEscolher={onEscolherLugar} />
    </section>
  )
}
