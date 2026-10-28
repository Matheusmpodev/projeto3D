import { MathUtils } from 'three'

// Clima do percurso: corredor escuro e misterioso quase todo o caminho, e a luz clareando
// só bem perto da porta. Todos os valores que mudam com o scroll ficam aqui.

// exposição do tone mapping (era 1.1 fixa)
export const EXPOSICAO_CORREDOR = 0.55
export const EXPOSICAO_PORTA = 1.2

// fração do scroll (0 a 1) em que a luz começa a subir; até aqui fica tudo no clima do corredor
export const INICIO_DA_LUZ = 0.8

// intensidade do Bloom (o limiar e o raio ficam no PosProcessamento.tsx)
export const BLOOM_CORREDOR = 0.3
export const BLOOM_PORTA = 0.9

// transição pro site: a camada creme cobre a tela entre estes dois pontos do progresso
export const INICIO_DA_CAMADA = 0.95 // câmera já dentro da luz da porta
// o progresso suavizado só se aproxima de 1 (nunca chega exato), então o "fim" é um pouco antes
export const FIM_DO_PERCURSO = 0.995

// 0 durante o corredor; de INICIO_DA_LUZ até o fim sobe suave (smoothstep: começa e termina
// devagar) até 1. Exposição e Bloom usam este mesmo valor, então crescem juntos.
export function luzDaPorta(progresso: number) {
  return MathUtils.smoothstep(progresso, INICIO_DA_LUZ, 1)
}

// opacidade da camada creme: 0 até INICIO_DA_CAMADA, 1 em FIM_DO_PERCURSO
export function opacidadeDaCamada(progresso: number) {
  return MathUtils.smoothstep(progresso, INICIO_DA_CAMADA, FIM_DO_PERCURSO)
}
