import { useEffect, useRef } from 'react'
import { CardAoVivo } from './CardAoVivo'
import { Hero } from './Hero'
import { Menu } from './Menu'
import { Rodape } from './Rodape'
import { SecaoAgora } from './SecaoAgora'
import { SecaoPrevisao } from './SecaoPrevisao'
import { SecaoQuemFez } from './SecaoQuemFez'
import { useClima } from '../hooks/useClima'
import './site.css'

// Conteúdo do site, com fundo opaco por cima do canvas (que fica parado atrás).
// Rola como uma página normal. Os dados vêm da Open-Meteo (ver useClima).
export function Site({ onReverEntrada }: { onReverEntrada: () => void }) {
  const { lugar, dados, erro, escolherLugar, tentarDeNovo } = useClima()
  const titulo = useRef<HTMLHeadingElement>(null)

  // o foco estava no corredor (ou no botão Pular, que sumiu): leva pro título do card,
  // pra quem navega por teclado ou leitor de tela saber que a página mudou
  useEffect(() => {
    titulo.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="site">
      {/* enquanto carrega, o fundo de sol (o mais neutro) */}
      <Hero clima={dados?.clima ?? 'sol'}>
        <Menu onReverEntrada={onReverEntrada} />
        <CardAoVivo
          lugar={lugar}
          dados={dados}
          erro={erro}
          onTentarDeNovo={tentarDeNovo}
          onEscolherLugar={escolherLugar}
          tituloRef={titulo}
        />
      </Hero>
      {/* com erro, a mensagem fica só no card; as seções voltam quando os dados chegarem */}
      {!erro && (
        <main className="site-secoes">
          <SecaoAgora dados={dados} />
          <SecaoPrevisao dias={dados?.previsao ?? null} />
        </main>
      )}
      {/* fora do <main> do clima: não depende dos dados, então aparece até com erro na API */}
      <div className="site-secoes">
        <SecaoQuemFez />
      </div>
      <Rodape />
    </div>
  )
}
