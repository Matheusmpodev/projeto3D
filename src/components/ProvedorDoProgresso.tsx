import type { ReactNode } from 'react'
import { ProgressoContext } from './progresso'
import { useProgressoSuavizado } from './useProgressoScroll'

// Calcula o progresso suavizado uma única vez e entrega para tudo dentro do Canvas.
export function ProvedorDoProgresso({ ativo, children }: { ativo: boolean; children: ReactNode }) {
  const progresso = useProgressoSuavizado(ativo)
  return <ProgressoContext value={progresso}>{children}</ProgressoContext>
}
