import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { FIM_DO_PERCURSO, INICIO_DA_CAMADA, opacidadeDaCamada } from './clima'
import { useProgresso } from './progresso'

type Props = {
  ativo: boolean // false quando o site já está aberto
  camada: RefObject<HTMLDivElement | null> // a camada creme (fica fora do Canvas, no DOM)
  onNaLuz: (naLuz: boolean) => void // entrou ou saiu dos 5% finais
  onFim: () => void // chegou ao fim do percurso
}

function pintarCamada(camada: HTMLDivElement | null, opacidade: number) {
  if (camada) camada.style.opacity = String(opacidade)
}

// Dentro do Canvas, mas sem nada 3D: a cada quadro ajusta a opacidade da camada creme direto
// no estilo (sem setState) e só avisa o React quando cruza um limite.
export function TransicaoDaPorta({ ativo, camada, onNaLuz, onFim }: Props) {
  const progresso = useProgresso()
  const cruzou = useRef({ naLuz: false, fim: false }) // último estado avisado

  useFrame(() => {
    if (!ativo) return // no site, quem cuida da camada é o CSS (fade de saída)
    const p = progresso.current
    pintarCamada(camada.current, opacidadeDaCamada(p))

    const naLuz = p >= INICIO_DA_CAMADA
    if (naLuz !== cruzou.current.naLuz) {
      cruzou.current.naLuz = naLuz
      onNaLuz(naLuz)
    }
    const fim = p >= FIM_DO_PERCURSO
    if (fim && !cruzou.current.fim) onFim()
    cruzou.current.fim = fim
  })

  return null
}
