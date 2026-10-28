// Formato dos dados do clima que o site mostra. O serviço da Open-Meteo (src/services/openMeteo.ts)
// converte as respostas da API para este formato; os componentes só conhecem este.

// escolhe o fundo do hero
export type Clima = 'sol' | 'chuva' | 'neve' | 'noite'

// nomes dos ícones em public/clima/icone-*.svg
export type IconeDoTempo = 'sol' | 'parcial' | 'nublado' | 'chuva' | 'tempestade' | 'neve' | 'lua'

// uma cidade (da busca) ou a posição do navegador
export type Lugar = {
  nome: string // "Montes Claros" ou "Sua localização"
  municipio?: string // quando o lugar é um distrito: o município a que pertence
  regiao?: string // estado: "Minas Gerais"
  pais?: string
  latitude: number
  longitude: number
}

export type DiaDaPrevisao = {
  data: string // "2026-10-28"
  icone: IconeDoTempo
  maxima: number // °C
  minima: number // °C
}

export type DadosDoClima = {
  cidade: string
  atualizadoEm: string // "2026-10-28T17:15", já na hora local da cidade
  clima: Clima
  icone: IconeDoTempo
  condicao: string // "Parcialmente nublado"
  temperatura: number // °C
  maxima: number
  minima: number
  sensacao: number
  chuva: { milimetros: number; probabilidade: number | null } // probabilidade em %
  umidade: number // %
  vento: { kmh: number; direcaoGraus: number } // de onde o vento vem (0 = norte)
  indiceUV: number | null // máximo do dia
  qualidadeDoAr: number | null // AQI (escala americana, 0 a 500); null se a API de ar falhar
  previsao: DiaDaPrevisao[]
}
