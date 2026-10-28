import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Iluminacao } from './Iluminacao'
import { Cenario } from './Cenario'
import { CameraDoBlender } from './CameraDoBlender'
import { PosProcessamento } from './PosProcessamento'
import { ExposicaoDoPercurso } from './ExposicaoDoPercurso'
import { EXPOSICAO_CORREDOR } from './clima'
import './CenaFundo.css'

// Canvas fixo ao fundo, ocupando a tela toda. Quem rola é a página (ver .trilha-scroll).
export function CenaFundo() {
  return (
    <div className="cena-fundo">
      <Canvas
        // "percentage" = PCFShadowMap; o PCFSoftShadowMap (padrão do R3F) foi removido do three 0.186
        shadows="percentage"
        dpr={[1, 2]}
        // com o pós-processamento ativo, o ACES é aplicado pelo efeito ToneMapping (que lê esta
        // mesma exposição); o toneMapping aqui vale quando o EffectComposer não está montado.
        // A exposição começa no valor do corredor e depois o ExposicaoDoPercurso assume
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: EXPOSICAO_CORREDOR }}
      >
        <Iluminacao />
        <ExposicaoDoPercurso />
        {/* Suspense segura a cena até o .glb terminar de carregar */}
        <Suspense fallback={null}>
          <Cenario />
          <CameraDoBlender />
        </Suspense>
        <PosProcessamento />
      </Canvas>
    </div>
  )
}
