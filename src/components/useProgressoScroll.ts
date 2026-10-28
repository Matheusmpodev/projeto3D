import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
// da roda. Só funciona dentro do Canvas, e é chamado uma vez só (no ProvedorDoProgresso):
// câmera, exposição, Bloom e transição leem o mesmo valor, então andam juntos.
// Fora do corredor (ativo = false) o progresso fica parado no fim, e o scroll da página
// passa a ser só do conteúdo.
export function useProgressoSuavizado(ativo: boolean) {
  const alvo = useProgressoScroll()
  const progresso = useRef(0)
  const invalidate = useThree((s) => s.invalidate)

  // ao entrar ou sair do corredor, pula direto pro início ou pro fim em vez de "voar" pelo
  // corredor; e pede um quadro, porque no site o canvas só renderiza sob demanda
  useEffect(() => {
    progresso.current = ativo ? 0 : 1
    invalidate()
  }, [ativo, invalidate])

  // prioridade -1: atualiza antes dos useFrame que leem o progresso (prioridade 0)
  useFrame((_, delta) => {
    if (ativo) progresso.current = MathUtils.damp(progresso.current, alvo.current, SUAVIDADE, delta)
  }, -1)

  return progresso
}
