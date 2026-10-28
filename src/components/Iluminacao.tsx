import { useState } from 'react'
import { Object3D } from 'three'

// Paredes, teto e chão têm a luz assada nas cores dos vértices e ignoram estas luzes.
// Elas só iluminam o que continua em tempo real (grama, flores, folhas, cadeiras...),
// então ajuste aqui até a grama combinar com as paredes.
const COR_SOL = '#ffe9c4'
const INTENSIDADE_SOL = 3 // era 4 antes do bake
const COR_CEU = '#d8e6c8' // HemisphereLight: luz que vem de cima
const COR_CHAO = '#26331c' // HemisphereLight: luz que vem de baixo
const INTENSIDADE_CEU = 0.7 // era 0.9 antes do bake

// névoa mais escura e fria (puxada pro azul) pra dar clima de mistério; era '#3a4634'
const COR_NEVOA = '#222b2e'
const DENSIDADE_NEVOA = 0.03

// Fundo, névoa e luzes.
export function Iluminacao() {
  // o alvo do sol precisa estar na cena para a matriz dele ser atualizada
  const [alvoDoSol] = useState(() => new Object3D())

  return (
    <>
      <color attach="background" args={['#1b241a']} />
      <fogExp2 attach="fog" args={[COR_NEVOA, DENSIDADE_NEVOA]} />

      {/* luz ambiente: céu esverdeado em cima, chão escuro embaixo */}
      <hemisphereLight args={[COR_CEU, COR_CHAO, INTENSIDADE_CEU]} />

      {/* sol entrando pelas janelas (mesma direção do Blender, convertida pro eixo Y pra cima) */}
      <primitive object={alvoDoSol} position={[0, 0, -15]} />
      <directionalLight
        color={COR_SOL}
        intensity={INTENSIDADE_SOL}
        position={[-20, 15, -8]}
        target={alvoDoSol}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
    </>
  )
}
