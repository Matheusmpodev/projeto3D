import { useSyncExternalStore } from 'react'

// Ponte entre o 3D e a tela de carregamento. O 3D vem num arquivo JS separado, baixado só quando
// o corredor aparece (ver App.tsx); a tela e o botão Pular ficam no pacote principal. Por isso
// este arquivo não importa nada do three nem da drei: se importasse, o 3D voltaria pro principal.

let percentual = 0
let cancelar: (() => void) | null = null
const ouvintes = new Set<() => void>()
const avisar = () => ouvintes.forEach((ouvinte) => ouvinte())

// o 3D chama ao começar a baixar a cena; o sinal é o que o Pular usa pra cancelar o download
export function comecarCarregamento(): AbortSignal {
  const controle = new AbortController()
  cancelar = () => controle.abort()
  percentual = 0
  avisar()
  return controle.signal
}

// Nunca volta (a estimativa oscila quando surgem arquivos novos no meio do caminho) e para em
// 99: os 100% quem dá é a tela, quando a cena já foi desenhada
export function informarPercentual(valor: number) {
  const novo = Math.min(99, Math.max(percentual, Math.floor(valor)))
  if (novo === percentual) return
  percentual = novo
  avisar()
}

// Pular antes da cena ficar pronta: para o download (quem já tem a cena não chama isto)
export function cancelarCarregamento() {
  cancelar?.()
  cancelar = null
}

const inscrever = (ouvinte: () => void) => {
  ouvintes.add(ouvinte)
  return () => void ouvintes.delete(ouvinte)
}

// re-renderiza só quando o número inteiro muda, não a cada pedaço baixado
export function usePercentualCarregado() {
  return useSyncExternalStore(inscrever, () => percentual)
}
