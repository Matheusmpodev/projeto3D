import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode, type BloomEffect } from 'postprocessing'
import { MathUtils } from 'three'
import { BLOOM_CORREDOR, BLOOM_PORTA, luzDaPorta } from '../lib/ambiente'
import { ehTelaDeToque } from '../lib/dispositivo'
import { useProgresso } from '../hooks/progresso'

// Bloom: só brilha o que passar do limiar. O valor é luminância HDR (linear, antes do tone
// mapping e da exposição), não brilho de tela. Medido na cena: paredes, teto, vigas e cortinas
// ficam abaixo de 1, os feixes e o FundoJanelas em ~1,5; com o REFORCO_BRILHO do Cenario.tsx,
// FundoPorta fica em ~3 visto de longe (a névoa apaga) e passa de 7 de perto.
// Se as paredes brilharem, suba o limiar. A intensidade muda com o scroll (ver ambiente.ts).
const BLOOM_LIMIAR = 2.5
const BLOOM_SUAVIDADE = 0.4 // faixa acima do limiar em que o brilho entra aos poucos
const BLOOM_RAIO = 0.75 // 0 a 1: espalhamento do brilho (mipmapBlur)

// Vinheta: escurece as bordas da tela
const VINHETA_INICIO = 0.35 // distância do centro onde começa a escurecer (maior = borda mais fina)
const VINHETA_ESCURIDAO = 0.45 // 0 = sem vinheta, 1 = bordas pretas

// Granulado de filme
const GRAO_OPACIDADE = 0.06

// direto no efeito, sem setState: muda todo quadro e não precisa re-renderizar o React
function ajustarBloom(bloom: BloomEffect | null, luz: number) {
  if (bloom) bloom.intensity = MathUtils.lerp(BLOOM_CORREDOR, BLOOM_PORTA, luz)
}

// Efeitos de tela aplicados depois de renderizar a cena.
// Modo leve (celular ou FPS baixo): só vinheta e tone mapping, sem Bloom e sem granulado.
export function PosProcessamento() {
  const [leve, setLeve] = useState(ehTelaDeToque) // celular já começa no modo leve
  const bloom = useRef<BloomEffect>(null)
  const progresso = useProgresso()

  // Bloom fraco no corredor, crescendo junto com a exposição perto da porta
  useFrame(() => ajustarBloom(bloom.current, luzDaPorta(progresso.current)))

  return (
    <>
      {/* mede o FPS e, se cair abaixo da faixa aceitável, liga o modo leve (e não volta,
          pra não ficar alternando e recompilando shaders) */}
      <PerformanceMonitor onDecline={() => setLeve(true)} />

      {/* o EffectComposer desliga o tone mapping do renderer e renderiza em HDR (half float);
          por isso o ToneMapping vem no fim da cadeia. A exposição vem do
          gl.toneMappingExposure, que o ExposicaoDoPercurso muda com o scroll */}
      <EffectComposer>
        {!leve && (
          <Bloom
            ref={bloom}
            mipmapBlur
            luminanceThreshold={BLOOM_LIMIAR}
            luminanceSmoothing={BLOOM_SUAVIDADE}
            intensity={BLOOM_CORREDOR}
            radius={BLOOM_RAIO}
          />
        )}
        <Vignette offset={VINHETA_INICIO} darkness={VINHETA_ESCURIDAO} />
        {/* OVERLAY com ruído médio 0,5 mantém o brilho médio: só adiciona textura */}
        {!leve && <Noise blendFunction={BlendFunction.OVERLAY} opacity={GRAO_OPACIDADE} />}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}
