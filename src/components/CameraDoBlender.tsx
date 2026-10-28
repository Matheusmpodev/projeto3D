import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCenaGLTF } from './useCenaGLTF'
import { useProgressoSuavizado } from './useProgressoScroll'

function ajustarTela(camera: THREE.PerspectiveCamera, largura: number, altura: number, fovBase: number) {
  camera.aspect = largura / altura
  camera.fov = camera.aspect < 1 ? fovBase * 1.35 : fovBase // celular em pé: abre um pouco a visão
  camera.updateProjectionMatrix()
}

// a animação fica sempre pausada: quem decide o tempo dela é o scroll
function tocarPausada(acao: THREE.AnimationAction) {
  acao.play()
  acao.paused = true
  return () => void acao.stop()
}

// progresso de 0 a 1 → tempo correspondente da animação
function irParaQuadro(acao: THREE.AnimationAction, progresso: number) {
  acao.time = THREE.MathUtils.clamp(progresso, 0, 1) * acao.getClip().duration
  acao.getMixer().update(0) // aplica o quadro atual sem avançar o relógio
}

// Usa a câmera animada do Blender como câmera ativa e liga a animação ao scroll:
// 0% de scroll = primeiro quadro, 100% = último quadro (entrando na porta).
export function CameraDoBlender() {
  const { scene, cameras, animations, parser } = useCenaGLTF()
  const camera = cameras[0] as THREE.PerspectiveCamera
  const set = useThree((s) => s.set)
  const get = useThree((s) => s.get)
  const size = useThree((s) => s.size)
  const progresso = useProgressoSuavizado()

  // FOV original lido direto do arquivo, porque camera.fov é alterado logo abaixo
  const fovBase = THREE.MathUtils.radToDeg(parser.json.cameras[0].perspective.yfov)

  // troca a câmera padrão do R3F pela do .glb (e devolve a antiga ao desmontar)
  useLayoutEffect(() => {
    const anterior = get().camera
    set({ camera })
    return () => set({ camera: anterior })
  }, [camera, get, set])

  // o R3F não ajusta o aspect quando a câmera é trocada, só no resize; então fazemos aqui
  useLayoutEffect(() => ajustarTela(camera, size.width, size.height, fovBase), [camera, fovBase, size])

  const acao = useMemo(() => {
    const acao = new THREE.AnimationMixer(scene).clipAction(animations[0])
    acao.setLoop(THREE.LoopOnce, 1)
    acao.clampWhenFinished = true
    return acao
  }, [scene, animations])

  // play e stop no mesmo efeito: o StrictMode monta, desmonta e monta de novo,
  // e cada montagem precisa deixar a ação tocando
  useEffect(() => tocarPausada(acao), [acao])

  useFrame(() => irParaQuadro(acao, progresso.current))

  return null
}
