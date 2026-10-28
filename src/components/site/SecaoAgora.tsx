import { CardClima } from './CardClima'
import { classificarAr, classificarUV, direcaoDoVento, notaDeUmidade, numero } from './formatacao'
import type { DadosDoClima } from './tipos'

// Seção AGORA/: as condições do momento, um card por medida.
export function SecaoAgora({ dados }: { dados: DadosDoClima }) {
  const { chuva, umidade, vento, indiceUV, qualidadeDoAr } = dados

  return (
    <section id="agora" className="secao" aria-labelledby="titulo-agora">
      <h2 id="titulo-agora" className="secao-titulo">
        AGORA<span aria-hidden="true">/</span>
      </h2>
      <div className="grade-agora">
        <CardClima
          rotulo="Chuva"
          icone="chuva"
          valor={numero(chuva.milimetros)}
          unidade="mm"
          nota={`${chuva.probabilidade}% de chance hoje`}
        />
        <CardClima rotulo="Umidade" icone="gota" valor={numero(umidade)} unidade="%" nota={notaDeUmidade(umidade)} />
        <CardClima
          rotulo="Vento"
          icone="vento"
          valor={numero(vento.kmh)}
          unidade="km/h"
          nota={`Vindo do ${direcaoDoVento(vento.direcaoGraus)}`}
        />
        <CardClima rotulo="Índice UV" icone="uv" valor={numero(indiceUV)} nota={classificarUV(indiceUV)} />
        <CardClima
          id="qualidade-do-ar"
          rotulo="Qualidade do ar"
          icone="folha"
          valor={numero(qualidadeDoAr)}
          unidade="AQI"
          nota={classificarAr(qualidadeDoAr)}
        />
      </div>
    </section>
  )
}
