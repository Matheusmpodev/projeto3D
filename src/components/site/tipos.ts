// Formato dos dados do clima que o site mostra. Na próxima etapa, a resposta da Open-Meteo é
// convertida para este formato, e nenhum componente precisa mudar.

// escolhe o fundo do hero e o ícone grande do card
export type Clima = 'sol' | 'chuva' | 'neve' | 'noite'

// nomes dos ícones em public/clima/icone-*.svg usados na previsão
export type IconeDoTempo = 'sol' | 'parcial' | 'nublado' | 'chuva' | 'tempestade' | 'neve' | 'lua'

export type DiaDaPrevisao = {
  data: string // "2026-10-28"
  icone: IconeDoTempo
  maxima: number // °C
  minima: number // °C
}

export type DadosDoClima = {
  cidade: string
  atualizadoEm: string // ISO, hora local da cidade
  clima: Clima
  condicao: string // "Ensolarado"
  temperatura: number // °C
  maxima: number
  minima: number
  sensacao: number
  chuva: { milimetros: number; probabilidade: number } // probabilidade em %
  umidade: number // %
  vento: { kmh: number; direcaoGraus: number } // de onde o vento vem (0 = norte)
  indiceUV: number
  qualidadeDoAr: number // AQI (escala americana, 0 a 500)
  previsao: DiaDaPrevisao[]
}
