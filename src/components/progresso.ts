import { createContext, useContext, type RefObject } from 'react'

// O progresso do percurso (0 = entrada, 1 = dentro da porta), compartilhado por contexto.
// É um ref, e não um valor: muda todo quadro e é lido só dentro de useFrame, então o
// contexto nunca muda e ninguém re-renderiza por causa dele.
export const ProgressoContext = createContext<RefObject<number> | null>(null)

export function useProgresso() {
  const progresso = useContext(ProgressoContext)
  if (!progresso) throw new Error('useProgresso precisa estar dentro do <ProvedorDoProgresso>')
  return progresso
}
