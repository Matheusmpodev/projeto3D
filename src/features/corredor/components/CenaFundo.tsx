import { Suspense, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Fase } from '../tipos'
import { Iluminacao } from './Iluminacao'
import { Cenario } from './Cenario'
import { CameraDoBlender } from './CameraDoBlender'
import { PosProcessamento } from './PosProcessamento'
import { ExposicaoDoPercurso } from './ExposicaoDoPercurso'
import { ProvedorDoProgresso } from './ProvedorDoProgresso'
import { TransicaoDaPorta } from './TransicaoDaPorta'
import { ControleDaInstrucao } from './ControleDaInstrucao'
import { EXPOSICAO_CORREDOR } from '../lib/ambiente'
import { faixaDeDpr } from '../lib/dispositivo'
import './CenaFundo.css'

type Props = {
  fase: Fase
  camada: RefObject<HTMLDivElement | null>
  instrucao: RefObject<HTMLDivElement | null> // "Atravesse o corredor…", no DOM
  onNaLuz: (naLuz: boolean) => void
  onFim: () => void
  onCenaPronta: () => void // a cena carregou e já foi desenhada (a tela de carregamento pode sair)
}

const DPR = faixaDeDpr()

// Fica dentro do Suspense, então só monta depois que o .glb carregou. Avisa no 2º quadro: o 1º
// é o que compila os shaders (e dá um tranco); assim a tela de carregamento sai com a cena pronta
function AvisoDeCenaPronta({ onPronta }: { onPronta: () => void }) {
  const quadros = useRef(0)
  useFrame(() => {
    quadros.current += 1
    if (quadros.current === 2) onPronta()
  })
  return null
}

// Canvas fixo ao fundo, ocupando a tela toda. No corredor, quem rola é a página
// (ver .trilha-scroll); no site, ele fica parado e escondido atrás do conteúdo opaco.
export function CenaFundo({ fase, camada, instrucao, onNaLuz, onFim, onCenaPronta }: Props) {
  const noCorredor = fase === 'corredor'

  return (
    <div className="cena-fundo">
      <Canvas
        // no site a cena fica escondida atrás do conteúdo: "demand" só renderiza quando
        // alguém pede (resize, invalidate), em vez de 60 quadros por segundo à toa
        frameloop={noCorredor ? 'always' : 'demand'}
        // "percentage" = PCFShadowMap; o PCFSoftShadowMap (padrão do R3F) foi removido do three 0.186
        shadows="percentage"
        dpr={DPR} // no celular, no máximo 1,5 (ver dispositivo.ts)
        // com o pós-processamento ativo, o ACES é aplicado pelo efeito ToneMapping (que lê esta
        // mesma exposição); o toneMapping aqui vale quando o EffectComposer não está montado.
        // A exposição começa no valor do corredor e depois o ExposicaoDoPercurso assume
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: EXPOSICAO_CORREDOR }}
      >
        <ProvedorDoProgresso ativo={noCorredor}>
          <Iluminacao />
          <ExposicaoDoPercurso />
          {/* Suspense segura a cena até o .glb terminar de carregar */}
          <Suspense fallback={null}>
            <Cenario />
            <CameraDoBlender />
            <AvisoDeCenaPronta onPronta={onCenaPronta} />
            <ControleDaInstrucao ativo={noCorredor} instrucao={instrucao} />
          </Suspense>
          <PosProcessamento />
          <TransicaoDaPorta ativo={noCorredor} camada={camada} onNaLuz={onNaLuz} onFim={onFim} />
        </ProvedorDoProgresso>
      </Canvas>
    </div>
  )
}
