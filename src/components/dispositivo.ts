// tela de toque como entrada principal (celular, tablet): usado como sinal de aparelho mais fraco
export const ehTelaDeToque = () => window.matchMedia('(pointer: coarse)').matches

// Resolução do canvas (devicePixelRatio). Celulares têm dpr 3 ou mais: renderizar 3×3 pixels
// por ponto custa 9× o trabalho da GPU, e numa tela pequena 1,5 já parece nítido
const DPR_MAXIMO = 2
const DPR_MAXIMO_CELULAR = 1.5

export const faixaDeDpr = (): [number, number] => [1, ehTelaDeToque() ? DPR_MAXIMO_CELULAR : DPR_MAXIMO]
