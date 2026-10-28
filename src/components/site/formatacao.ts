// Transforma os números crus dos dados em texto para a tela. Fica separado dos componentes
// porque vale igual para os dados falsos e para os da API.

const NUMERO = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

export const numero = (n: number) => NUMERO.format(n)
export const graus = (n: number) => `${Math.round(n)}°`

// "terça-feira, 28 de outubro · 14:30"
export function dataEHora(iso: string) {
  const d = new Date(iso)
  const data = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${data} · ${hora}`
}

// "HOJE", "QUI", "SEX"...
export function diaDaSemana(data: string, indice: number) {
  if (indice === 0) return 'HOJE'
  // meio-dia local: "2026-10-29" sozinho vira meia-noite UTC, que no Brasil ainda é o dia anterior
  return new Date(`${data}T12:00:00`)
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
    .toUpperCase()
}

const DIRECOES = ['norte', 'nordeste', 'leste', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste']

// 0° = norte, 45° = nordeste... (a direção meteorológica é de onde o vento vem)
export function direcaoDoVento(grausDoVento: number) {
  return DIRECOES[Math.round((((grausDoVento % 360) + 360) % 360) / 45) % 8]
}

// faixas da OMS
export function classificarUV(indice: number) {
  if (indice < 3) return 'Baixo'
  if (indice < 6) return 'Moderado'
  if (indice < 8) return 'Alto — use protetor'
  if (indice < 11) return 'Muito alto — evite o sol'
  return 'Extremo — evite o sol'
}

// faixas do AQI americano
export function classificarAr(aqi: number) {
  if (aqi <= 50) return 'Boa'
  if (aqi <= 100) return 'Moderada'
  if (aqi <= 150) return 'Ruim para sensíveis'
  if (aqi <= 200) return 'Ruim'
  if (aqi <= 300) return 'Muito ruim'
  return 'Perigosa'
}

export function notaDeUmidade(umidade: number) {
  if (umidade < 30) return 'Ar seco — beba água'
  if (umidade <= 60) return 'Confortável'
  return 'Ar úmido'
}
