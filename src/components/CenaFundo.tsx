import { Suspense, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import type { Fase } from '../App'
import { Iluminacao } from './Iluminacao'
import { Cenario } from './Cenario'
import { CameraDoBlender } from './CameraDoBlender'
import { PosProcessamento } from './PosProcessamento'
import { ExposicaoDoPercurso } from './ExposicaoDoPercurso'
import { ProvedorDoProgresso } from './ProvedorDoProgresso'
import { TransicaoDaPorta } from './TransicaoDaPorta'
import { EXPOSICAO_CORREDOR } from './clima'
import './CenaFundo.css'

type Props = {
  fase: Fase
  camada: RefObject<HTMLDivElement | null>
  onNaLuz: (naLuz: boolean) => void
  onFim: () => void
}

// Canvas fixo ao fundo, ocupando a tela toda. No corredor, quem rola é a página
// (ver .trilha-scroll); no site, ele fica parado e escondido atrás do conteúdo opaco.
export function CenaFundo({ fase, camada, onNaLuz, onFim }: Props) {
  const noCorredor = fase === 'corredor'

  return (
    <div className="cena-fundo">
      <Canvas
        // no site a cena fica escondida atrás do conteúdo: "demand" só renderiza quando
        // alguém pede (resize, invalidate), em vez de 60 quadros por segundo à toa
        frameloop={noCorredor ? 'always' : 'demand'}
        // "percentage" = PCFShadowMap; o PCFSoftShadowMap (padrão do R3F) foi removido do three 0.186
        shadows="percentage"
        dpr={[1, 2]}
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
          </Suspense>
          <PosProcessamento />
          <TransicaoDaPorta ativo={noCorredor} camada={camada} onNaLuz={onNaLuz} onFim={onFim} />
        </ProvedorDoProgresso>
      </Canvas>
    </div>
  )
}
