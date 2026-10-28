import { useCallback, useEffect, useRef, useState } from 'react'
import { CenaFundo } from './components/CenaFundo'
import { CamadaDeLuz } from './components/abertura/CamadaDeLuz'
import { BotaoPular } from './components/abertura/BotaoPular'
import { Site } from './components/site/Site'

// 'corredor': o scroll da página move a câmera; 'site': o conteúdo rola como página normal
export type Fase = 'corredor' | 'site'

// com prefers-reduced-motion, vai direto ao conteúdo
const faseInicial = (): Fase =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'site' : 'corredor'

function App() {
  const [fase, setFase] = useState<Fase>(faseInicial)
  // câmera nos 5% finais (dentro da luz): o botão Pular some. Muda só ao cruzar o limite
  const [naLuz, setNaLuz] = useState(false)
  const camada = useRef<HTMLDivElement>(null)

  // cada fase começa do topo: o corredor na entrada, o conteúdo no título.
  // Com chaves de propósito: no Chrome atual scrollTo() devolve uma Promise, e o useEffect
  // trataria esse retorno como função de limpeza (e quebraria)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [fase])

  const abrirSite = useCallback(() => setFase('site'), [])

  const reverEntrada = useCallback(() => {
    // a camada ainda tem a opacidade do fim do corredor (1) no estilo inline; zera antes de
    // tirar o .saindo, senão a tela pisca branca até o próximo quadro do canvas
    if (camada.current) camada.current.style.opacity = '0'
    setNaLuz(false)
    setFase('corredor')
  }, [])

  const noCorredor = fase === 'corredor'

  return (
    <>
      <CenaFundo fase={fase} camada={camada} onNaLuz={setNaLuz} onFim={abrirSite} />
      <CamadaDeLuz ref={camada} saindo={!noCorredor} />
      {noCorredor ? (
        <>
          <div className="trilha-scroll" aria-hidden="true" />
          {!naLuz && <BotaoPular onPular={abrirSite} />}
        </>
      ) : (
        <Site onReverEntrada={reverEntrada} />
      )}
    </>
  )
}

export default App
