import { useEffect, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useProgresso } from '../hooks/progresso'

const FIM_DA_INSTRUCAO = 0.03 // passou de ~3% do percurso: a instrução some
const ESPERA_PRA_REAPARECER = 4 // s parado no início pra ela voltar
// abaixo de 1% do percurso por segundo conta como parada. É por segundo, e não por quadro,
// pra valer igual em 30 ou 120 fps; e precisa de folga porque o progresso suavizado não para
// de uma vez: ele vai se aproximando do scroll cada vez mais devagar
const VELOCIDADE_MINIMA = 0.01

type Estado = { noInicio: boolean; parado: number; anterior: number }
const estadoInicial = (): Estado => ({ noInicio: true, parado: 0, anterior: 0 })

// Decide se a instrução aparece neste quadro. Aparece logo na chegada (noInicio) e some ao
// passar dos 3%; depois disso, só volta se a pessoa estiver de novo nos 3% iniciais e parada
// por ESPERA_PRA_REAPARECER segundos.
function decidir(e: Estado, progresso: number, delta: number) {
  const velocidade = delta > 0 ? Math.abs(progresso - e.anterior) / delta : 0
  if (velocidade > VELOCIDADE_MINIMA) e.parado = 0
  else e.parado += delta
  e.anterior = progresso

  if (progresso > FIM_DA_INSTRUCAO) e.noInicio = false
  else if (e.parado >= ESPERA_PRA_REAPARECER) e.noInicio = true
  return progresso <= FIM_DA_INSTRUCAO && e.noInicio
}

// só mexe no DOM quando a decisão muda; o fade é a transição CSS de .instrucao
function mostrar(instrucao: HTMLDivElement | null, visivel: boolean) {
  if (instrucao && instrucao.classList.contains('visivel') !== visivel) {
    instrucao.classList.toggle('visivel', visivel)
  }
}

type Props = {
  ativo: boolean // false quando o site está aberto
  instrucao: RefObject<HTMLDivElement | null> // o texto fica fora do Canvas, no DOM
}

// Dentro do Canvas e do Suspense da cena: só começa quando a cena carregou, ou seja, junto com o
// fade da tela de carregamento. Lê o progresso suavizado a cada quadro, sem setState.
export function ControleDaInstrucao({ ativo, instrucao }: Props) {
  const progresso = useProgresso()
  const estado = useRef(estadoInicial())

  // "Rever a entrada": volta ao início, e a instrução aparece de novo
  useEffect(() => {
    if (ativo) estado.current = estadoInicial()
  }, [ativo])

  useFrame((_, delta) => {
    if (ativo) mostrar(instrucao.current, decidir(estado.current, progresso.current, delta))
  })

  return null
}
