import { CardClima } from './CardClima'
import { classificarAr, classificarUV, direcaoDoVento, notaDeUmidade, numero } from '../lib/formatacao'
import type { NomeDoIcone } from '../lib/imagens'
import type { DadosDoClima } from '../tipos'

const SEM_DADO = '—'

type Item = {
  id?: string
  rotulo: string
  icone: NomeDoIcone
  unidade?: string
  valor: (d: DadosDoClima) => string
  nota: (d: DadosDoClima) => string
}

// um card por medida; cada um sabe tirar seu valor e sua nota dos dados
const ITENS: Item[] = [
  {
    rotulo: 'Chuva',
    icone: 'chuva',
    unidade: 'mm',
    valor: (d) => numero(d.chuva.milimetros),
    nota: (d) => (d.chuva.probabilidade === null ? 'Agora' : `${d.chuva.probabilidade}% de chance hoje`),
  },
  {
    rotulo: 'Umidade',
    icone: 'gota',
    unidade: '%',
    valor: (d) => numero(d.umidade),
    nota: (d) => notaDeUmidade(d.umidade),
  },
  {
    rotulo: 'Vento',
    icone: 'vento',
    unidade: 'km/h',
    valor: (d) => numero(d.vento.kmh),
    nota: (d) => `Vindo do ${direcaoDoVento(d.vento.direcaoGraus)}`,
  },
  {
    rotulo: 'Índice UV',
    icone: 'uv',
    unidade: 'máx. hoje',
    valor: (d) => (d.indiceUV === null ? SEM_DADO : numero(d.indiceUV)),
    nota: (d) => (d.indiceUV === null ? 'Sem dados' : classificarUV(d.indiceUV)),
  },
  {
    id: 'qualidade-do-ar',
    rotulo: 'Qualidade do ar',
    icone: 'folha',
    unidade: 'AQI',
    valor: (d) => (d.qualidadeDoAr === null ? SEM_DADO : numero(d.qualidadeDoAr)),
    nota: (d) => (d.qualidadeDoAr === null ? 'Sem dados agora' : classificarAr(d.qualidadeDoAr)),
  },
]

// Seção AGORA/: as condições do momento. Sem dados (carregando), os cards viram esqueleto.
export function SecaoAgora({ dados }: { dados: DadosDoClima | null }) {
  return (
    <section id="agora" className="secao" aria-labelledby="titulo-agora">
      <h2 id="titulo-agora" className="secao-titulo">
        AGORA<span aria-hidden="true">/</span>
      </h2>
      <div className="grade-agora">
        {ITENS.map(({ valor, nota, ...item }) => (
          <CardClima
            key={item.rotulo}
            {...item}
            valor={dados ? valor(dados) : undefined}
            nota={dados ? nota(dados) : undefined}
          />
        ))}
      </div>
    </section>
  )
}
