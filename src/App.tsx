import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { cancelarCarregamento } from './components/carregamento'
import { CamadaDeLuz } from './components/abertura/CamadaDeLuz'
import { BotaoPular } from './components/abertura/BotaoPular'
import { InstrucaoDoCorredor } from './components/abertura/InstrucaoDoCorredor'
import { TelaDeCarregamento } from './components/abertura/TelaDeCarregamento'
import { Site } from './components/site/Site'

// O 3D (three, R3F, drei, pós-processamento) fica num arquivo JS separado, baixado só quando
// o corredor aparece pela primeira vez. Quem usa "reduzir movimento" não baixa nada dele
const CenaFundo = lazy(() => import('./components/CenaFundo').then((m) => ({ default: m.CenaFundo })))

// 'corredor': o scroll da página move a câmera; 'site': o conteúdo rola como página normal
export type Fase = 'corredor' | 'site'

// com prefers-reduced-motion, vai direto ao conteúdo
const faseInicial = (): Fase =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'site' : 'corredor'

function App() {
  const [fase, setFase] = useState<Fase>(faseInicial)
  // câmera nos 5% finais (dentro da luz): o botão Pular some. Muda só ao cruzar o limite
  const [naLuz, setNaLuz] = useState(false)
  // a cena.glb carregou e foi desenhada. Continua true depois: "Rever a entrada" não recarrega
  const [cenaPronta, setCenaPronta] = useState(false)
  const camada = useRef<HTMLDivElement>(null)
  const instrucao = useRef<HTMLDivElement>(null)

  // cada fase começa do topo: o corredor na entrada, o conteúdo no título.
  // Com chaves de propósito: no Chrome atual scrollTo() devolve uma Promise, e o useEffect
  // trataria esse retorno como função de limpeza (e quebraria)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [fase])

  const abrirSite = useCallback(() => setFase('site'), [])
  const marcarCenaPronta = useCallback(() => setCenaPronta(true), [])

  // Pular antes da cena ficar pronta cancela o download (e o 3D é desmontado, ver com3D)
  const pular = useCallback(() => {
    if (!cenaPronta) cancelarCarregamento()
    setFase('site')
  }, [cenaPronta])

  const reverEntrada = useCallback(() => {
    // a camada ainda tem a opacidade do fim do corredor (1) no estilo inline; zera antes de
    // tirar o .saindo, senão a tela pisca branca até o próximo quadro do canvas
    if (camada.current) camada.current.style.opacity = '0'
    setNaLuz(false)
    setFase('corredor')
  }, [])

  const noCorredor = fase === 'corredor'
  // No site, o 3D só continua montado (parado atrás do conteúdo) se a cena já carregou:
  // assim "Rever a entrada" é instantâneo. Senão sai, e volta a carregar no "Rever a entrada"
  const com3D = noCorredor || cenaPronta

  return (
    <>
      {com3D && (
        // enquanto o arquivo JS do 3D chega, a tela de carregamento já cobre tudo (em 0%)
        <Suspense fallback={null}>
          <CenaFundo
            fase={fase}
            camada={camada}
            instrucao={instrucao}
            onNaLuz={setNaLuz}
            onFim={abrirSite}
            onCenaPronta={marcarCenaPronta}
          />
        </Suspense>
      )}
      <CamadaDeLuz ref={camada} saindo={!noCorredor} />
      {noCorredor ? (
        <>
          {/* a trilha (que dá altura pra rolar) só entra com a cena pronta: durante o
              carregamento não há o que rolar, e um scroll feito "às cegas" faria a câmera
              pular pro meio do corredor assim que ela aparecesse */}
          {cenaPronta && <div className="trilha-scroll" aria-hidden="true" />}
          {/* invisível até o 3D mandar aparecer (ver ControleDaInstrucao) */}
          <InstrucaoDoCorredor ref={instrucao} />
          <TelaDeCarregamento pronta={cenaPronta} />
          {!naLuz && <BotaoPular onPular={pular} />}
        </>
      ) : (
        <Site onReverEntrada={reverEntrada} />
      )}
    </>
  )
}

export default App
