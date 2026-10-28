import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, type WebGLRenderer } from 'three'
import { EXPOSICAO_CORREDOR, EXPOSICAO_PORTA, luzDaPorta } from './clima'
import { useProgresso } from './progresso'

function aplicarExposicao(gl: WebGLRenderer, luz: number) {
  gl.toneMappingExposure = MathUtils.lerp(EXPOSICAO_CORREDOR, EXPOSICAO_PORTA, luz)
}

// Exposição guiada pelo scroll: escura no corredor, clareando perto da porta.
// O efeito ToneMapping do pós-processamento usa o uniform toneMappingExposure do three, que o
// renderer reenvia sempre que troca de shader — e isso acontece todo quadro (cena → EffectPass),
// então basta mudar gl.toneMappingExposure, sem setState nem acesso ao efeito.
export function ExposicaoDoPercurso() {
  const gl = useThree((s) => s.gl)
  const progresso = useProgresso()

  useFrame(() => aplicarExposicao(gl, luzDaPorta(progresso.current)))

  return null
}
