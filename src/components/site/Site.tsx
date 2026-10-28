import { useEffect, useRef } from 'react'
import { CardAoVivo } from './CardAoVivo'
import { DADOS_DE_EXEMPLO } from './dadosFalsos'
import { Hero } from './Hero'
import { Menu } from './Menu'
import { Rodape } from './Rodape'
import { SecaoAgora } from './SecaoAgora'
import { SecaoPrevisao } from './SecaoPrevisao'
import './site.css'

// Conteúdo do site, com fundo opaco por cima do canvas (que fica parado atrás).
// Rola como uma página normal.
export function Site({ onReverEntrada }: { onReverEntrada: () => void }) {
  const dados = DADOS_DE_EXEMPLO // a Open-Meteo substitui só este objeto
  const titulo = useRef<HTMLHeadingElement>(null)

  // o foco estava no corredor (ou no botão Pular, que sumiu): leva pro título do card,
  // pra quem navega por teclado ou leitor de tela saber que a página mudou
  useEffect(() => {
    titulo.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="site">
      <Hero clima={dados.clima}>
        <Menu onReverEntrada={onReverEntrada} />
        <CardAoVivo dados={dados} tituloRef={titulo} />
      </Hero>
      <main className="site-secoes">
        <SecaoAgora dados={dados} />
        <SecaoPrevisao dias={dados.previsao} />
      </main>
      <Rodape />
    </div>
  )
}
