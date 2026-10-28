import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

// quanto maior, mais rápido o progresso alcança o scroll (4 ≈ 0,25 s de atraso)
const SUAVIDADE = 4

// Progresso do scroll da página: 0 no topo, 1 no fim.
// Fica num ref (e não em state) porque muda a cada pixel rolado e só é lido dentro do
// useFrame; com state, o React re-renderizaria o componente a cada evento de scroll.
export function useProgressoScroll() {
  const progresso = useRef(0)

  useEffect(() => {
    const atualizar = () => {
      const maximo = document.documentElement.scrollHeight - window.innerHeight
      progresso.current = maximo > 0 ? window.scrollY / maximo : 0
    }
    atualizar()
    window.addEventListener('scroll', atualizar, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      window.removeEventListener('scroll', atualizar)
      window.removeEventListener('resize', atualizar)
    }
  }, [])

  return progresso
}

// Progresso que persegue o scroll com atraso suave, em vez de pular junto com cada "clique"
// da roda. Só funciona dentro do Canvas. Câmera, exposição e Bloom usam este mesmo cálculo,
// então a luz acompanha a posição da câmera, e não o scroll cru.
export function useProgressoSuavizado() {
  const alvo = useProgressoScroll()
  const progresso = useRef(0)

  // prioridade -1: atualiza antes dos useFrame que leem o progresso (prioridade 0)
  useFrame((_, delta) => {
    progresso.current = MathUtils.damp(progresso.current, alvo.current, SUAVIDADE, delta)
  }, -1)

  return progresso
}
