import { Icone } from './Icone'
import { diaDaSemana, graus } from './formatacao'
import type { DiaDaPrevisao } from './tipos'

const DIAS = 7

// Seção PRÓXIMOS 7 DIAS/: dia, ícone e máxima/mínima. Sem dados (carregando) = esqueleto.
export function SecaoPrevisao({ dias }: { dias: DiaDaPrevisao[] | null }) {
  return (
    <section id="previsao" className="secao" aria-labelledby="titulo-previsao" aria-busy={!dias}>
      <h2 id="titulo-previsao" className="secao-titulo">
        PRÓXIMOS 7 DIAS<span aria-hidden="true">/</span>
      </h2>
      <ol className="grade-previsao">
        {dias
          ? dias.map((dia, i) => (
              <li key={dia.data} className="dia-previsao borda-pixel">
                <span className="dia-nome">{diaDaSemana(dia.data, i)}</span>
                <Icone nome={dia.icone} tamanho={40} />
                <span className="dia-temperaturas">
                  <span className="so-leitor">máxima </span>
                  <span className="dia-maxima">{graus(dia.maxima)}</span>
                  <span className="so-leitor">, mínima </span>
                  <span className="dia-minima">{graus(dia.minima)}</span>
                </span>
              </li>
            ))
          : Array.from({ length: DIAS }, (_, i) => (
              <li key={i} className="dia-previsao borda-pixel" aria-hidden="true">
                <span className="esqueleto" style={{ width: '3em', height: '0.8rem' }} />
                <span className="esqueleto" style={{ width: '40px', height: '40px' }} />
                <span className="esqueleto" style={{ width: '5em', height: '1.25rem' }} />
              </li>
            ))}
      </ol>
    </section>
  )
}
