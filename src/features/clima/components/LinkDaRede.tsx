import type { ReactNode } from 'react'
import type { Rede } from '../lib/contato'

// Link pessoal que abre em nova aba. Fica num componente só pra seção e rodapé nunca ficarem
// diferentes: noopener impede a outra aba de controlar esta (window.opener), noreferrer não
// envia o endereço daqui; o aria-label avisa ao leitor de tela que abre outra aba.
export function LinkDaRede({ rede, className, children }: { rede: Rede; className?: string; children: ReactNode }) {
  return (
    <a
      className={className}
      href={rede.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir meu ${rede.nome} em nova aba`}
    >
      {children}
    </a>
  )
}
