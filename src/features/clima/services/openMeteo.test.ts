import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Lugar } from '../tipos'
import {
  buscarCidades,
  buscarClima,
  paraDadosDoClima,
  type RespostaGeocoding,
  type RespostaPrevisao,
  type RespostaQualidadeDoAr,
} from './openMeteo'

// Respostas de exemplo no formato real da Open-Meteo (só os campos que o site pede).
// Nenhum teste chama a internet: o fetch é trocado por um falso.

const MONTES_CLAROS: Lugar = { nome: 'Montes Claros', regiao: 'Minas Gerais', pais: 'Brasil', latitude: -16.735, longitude: -43.86167 }

const PREVISAO: RespostaPrevisao = {
  current: {
    time: '2026-10-28T17:15',
    temperature_2m: 24.6,
    apparent_temperature: 26.1,
    relative_humidity_2m: 58,
    precipitation: 0.2,
    weather_code: 2,
    wind_speed_10m: 11.3,
    wind_direction_10m: 95,
    is_day: 1,
  },
  daily: {
    time: ['2026-10-28', '2026-10-29', '2026-10-30'],
    weather_code: [2, 63, 0],
    temperature_2m_max: [28.4, 25.1, 30.2],
    temperature_2m_min: [18.9, 19.3, 17.8],
    uv_index_max: [9.15, 6.2, null],
    precipitation_probability_max: [35, 80, null],
  },
}

const AR: RespostaQualidadeDoAr = { current: { time: '2026-10-28T17:00', us_aqi: 33 } }

describe('paraDadosDoClima', () => {
  it('converte a previsão e o ar para o formato do site', () => {
    expect(paraDadosDoClima(MONTES_CLAROS, PREVISAO, AR)).toEqual({
      cidade: 'Montes Claros',
      atualizadoEm: '2026-10-28T17:15',
      clima: 'sol',
      icone: 'parcial',
      condicao: 'Parcialmente nublado',
      temperatura: 24.6,
      maxima: 28.4,
      minima: 18.9,
      sensacao: 26.1,
      chuva: { milimetros: 0.2, probabilidade: 35 },
      umidade: 58,
      vento: { kmh: 11.3, direcaoGraus: 95 },
      indiceUV: 9.15,
      qualidadeDoAr: 33,
      previsao: [
        { data: '2026-10-28', icone: 'parcial', maxima: 28.4, minima: 18.9 },
        { data: '2026-10-29', icone: 'chuva', maxima: 25.1, minima: 19.3 },
        { data: '2026-10-30', icone: 'sol', maxima: 30.2, minima: 17.8 },
      ],
    })
  })

  it('à noite usa o fundo e o ícone de noite, mas a previsão dos próximos dias continua com ícone de dia', () => {
    const noite = { ...PREVISAO, current: { ...PREVISAO.current, weather_code: 0, is_day: 0 as const } }
    const dados = paraDadosDoClima(MONTES_CLAROS, noite, AR)
    expect(dados).toMatchObject({ clima: 'noite', icone: 'lua', condicao: 'Céu limpo' })
    expect(dados.previsao[2].icone).toBe('sol')
  })

  it('sem a resposta do ar, e com UV e chance de chuva nulos, devolve null em vez de quebrar', () => {
    const semDados = {
      ...PREVISAO,
      daily: { ...PREVISAO.daily, uv_index_max: [null], precipitation_probability_max: [null] },
    }
    const dados = paraDadosDoClima(MONTES_CLAROS, semDados, null)
    expect(dados.qualidadeDoAr).toBeNull()
    expect(dados.indiceUV).toBeNull()
    expect(dados.chuva.probabilidade).toBeNull()
  })
})

// fetch falso: responde conforme o endereço pedido
function trocarFetch(respostas: (url: URL) => { status?: number; corpo: unknown }) {
  const falso = vi.fn(async (endereco: string | URL | Request) => {
    const { status = 200, corpo } = respostas(new URL(String(endereco)))
    return new Response(JSON.stringify(corpo), { status })
  })
  vi.stubGlobal('fetch', falso)
  return falso
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('buscarCidades', () => {
  it('sem nenhuma cidade, a API omite "results": devolve lista vazia', async () => {
    trocarFetch(() => ({ corpo: { generationtime_ms: 0.4 } }))
    await expect(buscarCidades('xyzxyz')).resolves.toEqual([])
  })

  it('converte os resultados (admin1 = estado, admin2 = município) e pede 5 em português', async () => {
    const corpo: RespostaGeocoding = {
      results: [
        { id: 1, name: 'Recife', latitude: -8.05, longitude: -34.88, country: 'Brasil', admin1: 'Pernambuco', admin2: 'Recife' },
        { id: 2, name: 'Recife', latitude: -11.6, longitude: -41.7, country: 'Brasil', admin1: 'Bahia', admin2: 'Ibititá' },
      ],
    }
    const falso = trocarFetch(() => ({ corpo }))
    await expect(buscarCidades('Recife')).resolves.toEqual([
      { nome: 'Recife', municipio: 'Recife', regiao: 'Pernambuco', pais: 'Brasil', latitude: -8.05, longitude: -34.88 },
      { nome: 'Recife', municipio: 'Ibititá', regiao: 'Bahia', pais: 'Brasil', latitude: -11.6, longitude: -41.7 },
    ])
    const pedido = new URL(String(falso.mock.calls[0][0]))
    expect(pedido.hostname).toBe('geocoding-api.open-meteo.com')
    expect(Object.fromEntries(pedido.searchParams)).toMatchObject({ name: 'Recife', count: '5', language: 'pt' })
  })

  it('erro HTTP vira exceção', async () => {
    trocarFetch(() => ({ status: 500, corpo: {} }))
    await expect(buscarCidades('Recife')).rejects.toThrow('Open-Meteo respondeu 500')
  })
})

describe('buscarClima', () => {
  it('se só a API do ar falhar, o clima vem mesmo assim, sem a qualidade do ar', async () => {
    trocarFetch((url) =>
      url.hostname === 'air-quality-api.open-meteo.com' ? { status: 503, corpo: {} } : { corpo: PREVISAO },
    )
    const dados = await buscarClima(MONTES_CLAROS)
    expect(dados.temperatura).toBe(24.6)
    expect(dados.qualidadeDoAr).toBeNull()
  })

  it('se a previsão falhar, a busca toda falha (o site mostra o erro com "Tentar de novo")', async () => {
    trocarFetch((url) => (url.hostname === 'api.open-meteo.com' ? { status: 500, corpo: {} } : { corpo: AR }))
    await expect(buscarClima(MONTES_CLAROS)).rejects.toThrow()
  })
})
