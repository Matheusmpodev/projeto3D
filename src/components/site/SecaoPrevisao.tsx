import { Icone } from './Icone'
import { diaDaSemana, graus } from './formatacao'
import type { DiaDaPrevisao } from './tipos'

// Seção PRÓXIMOS 7 DIAS/: dia, ícone e máxima/mínima.
export function SecaoPrevisao({ dias }: { dias: DiaDaPrevisao[] }) {
  return (
    <section id="previsao" className="secao" aria-labelledby="titulo-previsao">
      <h2 id="titulo-previsao" className="secao-titulo">
        PRÓXIMOS 7 DIAS<span aria-hidden="true">/</span>
      </h2>
      <ol className="grade-previsao">
        {dias.map((dia, i) => (
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
        ))}
      </ol>
    </section>
  )
}
