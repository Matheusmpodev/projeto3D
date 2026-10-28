import type { DadosDoClima, Lugar } from '../components/site/tipos'
import { descreverTempo } from './codigosDoTempo'

// Chamadas à Open-Meteo: grátis, sem chave e com CORS liberado, então dá pra chamar direto
// do navegador. Este arquivo é o único que conhece o formato da API; o resto do site só vê
// DadosDoClima e Lugar.

const GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search'
const PREVISAO = 'https://api.open-meteo.com/v1/forecast'
const QUALIDADE_DO_AR = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const CAMPOS_ATUAIS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'is_day',
].join(',')
const CAMPOS_DIARIOS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'uv_index_max',
  'precipitation_probability_max', // pra nota "x% de chance hoje" do card de chuva
].join(',')

// ---------- Tipos das respostas (só os campos pedidos) ----------

type ResultadoGeocoding = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string // estado
  admin2?: string // município (distingue lugares com o mesmo nome no mesmo estado)
}

// sem nenhuma cidade encontrada, a API omite "results" (em vez de mandar lista vazia)
export type RespostaGeocoding = { results?: ResultadoGeocoding[] }

export type RespostaPrevisao = {
  current: {
    time: string // "2026-10-28T17:15", hora local (timezone=auto)
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number // km/h
    wind_direction_10m: number // graus
    is_day: 0 | 1
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    uv_index_max: (number | null)[]
    precipitation_probability_max: (number | null)[]
  }
}

export type RespostaQualidadeDoAr = {
  current: { time: string; us_aqi: number | null }
}

// ---------- Chamadas ----------

async function pegarJson<T>(url: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const resposta = await fetch(`${url}?${new URLSearchParams(params)}`, { signal })
  if (!resposta.ok) throw new Error(`Open-Meteo respondeu ${resposta.status}`)
  return (await resposta.json()) as T
}

// sugestões de cidade pelo nome (até 5)
export async function buscarCidades(nome: string, signal?: AbortSignal): Promise<Lugar[]> {
  const resposta = await pegarJson<RespostaGeocoding>(
    GEOCODING,
    { name: nome, count: '5', language: 'pt', format: 'json' },
    signal,
  )
  return (resposta.results ?? []).map((r) => ({
    nome: r.name,
    municipio: r.admin2,
    regiao: r.admin1,
    pais: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}

// clima atual, previsão de 7 dias e qualidade do ar de um lugar, já no formato do site
export async function buscarClima(lugar: Lugar, signal?: AbortSignal): Promise<DadosDoClima> {
  const coordenadas = { latitude: String(lugar.latitude), longitude: String(lugar.longitude), timezone: 'auto' }

  // as duas chamadas em paralelo
  const [previsao, ar] = await Promise.all([
    pegarJson<RespostaPrevisao>(
      PREVISAO,
      { ...coordenadas, current: CAMPOS_ATUAIS, daily: CAMPOS_DIARIOS, forecast_days: '7' },
      signal,
    ),
    // a qualidade do ar é um extra: se essa API falhar, o resto do clima aparece mesmo assim
    pegarJson<RespostaQualidadeDoAr>(QUALIDADE_DO_AR, { ...coordenadas, current: 'us_aqi' }, signal).catch(
      () => null,
    ),
  ])

  return paraDadosDoClima(lugar, previsao, ar)
}

// ---------- Conversão API → site ----------

export function paraDadosDoClima(
  lugar: Lugar,
  { current: atual, daily: diario }: RespostaPrevisao,
  ar: RespostaQualidadeDoAr | null,
): DadosDoClima {
  const tempo = descreverTempo(atual.weather_code, atual.is_day === 1)

  return {
    cidade: lugar.nome,
    atualizadoEm: atual.time,
    clima: tempo.fundo,
    icone: tempo.icone,
    condicao: tempo.texto,
    temperatura: atual.temperature_2m,
    maxima: diario.temperature_2m_max[0],
    minima: diario.temperature_2m_min[0],
    sensacao: atual.apparent_temperature,
    chuva: { milimetros: atual.precipitation, probabilidade: diario.precipitation_probability_max[0] ?? null },
    umidade: atual.relative_humidity_2m,
    vento: { kmh: atual.wind_speed_10m, direcaoGraus: atual.wind_direction_10m },
    indiceUV: diario.uv_index_max[0] ?? null,
    qualidadeDoAr: ar?.current.us_aqi ?? null,
    previsao: diario.time.map((data, i) => ({
      data,
      icone: descreverTempo(diario.weather_code[i]).icone, // previsão diária: sempre o ícone de dia
      maxima: diario.temperature_2m_max[i],
      minima: diario.temperature_2m_min[i],
    })),
  }
}
