import type { Clima, IconeDoTempo } from '../components/site/tipos'

// Tradução dos códigos de tempo WMO (campo weather_code da Open-Meteo) para o que o site mostra.
// Tabela oficial: https://open-meteo.com/en/docs (seção "WMO Weather interpretation codes")

type Descricao = { texto: string; icone: IconeDoTempo; fundo: Clima }

const CODIGOS: Record<number, Descricao> = {
  0: { texto: 'Ensolarado', icone: 'sol', fundo: 'sol' },
  1: { texto: 'Poucas nuvens', icone: 'parcial', fundo: 'sol' },
  2: { texto: 'Parcialmente nublado', icone: 'parcial', fundo: 'sol' },
  // nublado e neblina usam o fundo de sol (que tem nuvens): o de chuva mostra chuva caindo
  3: { texto: 'Nublado', icone: 'nublado', fundo: 'sol' },
  45: { texto: 'Neblina', icone: 'nublado', fundo: 'sol' },
  48: { texto: 'Neblina com geada', icone: 'nublado', fundo: 'sol' },
  51: { texto: 'Garoa fraca', icone: 'chuva', fundo: 'chuva' },
  53: { texto: 'Garoa', icone: 'chuva', fundo: 'chuva' },
  55: { texto: 'Garoa forte', icone: 'chuva', fundo: 'chuva' },
  56: { texto: 'Garoa congelante', icone: 'chuva', fundo: 'chuva' },
  57: { texto: 'Garoa congelante forte', icone: 'chuva', fundo: 'chuva' },
  61: { texto: 'Chuva fraca', icone: 'chuva', fundo: 'chuva' },
  63: { texto: 'Chuva', icone: 'chuva', fundo: 'chuva' },
  65: { texto: 'Chuva forte', icone: 'chuva', fundo: 'chuva' },
  66: { texto: 'Chuva congelante', icone: 'chuva', fundo: 'chuva' },
  67: { texto: 'Chuva congelante forte', icone: 'chuva', fundo: 'chuva' },
  71: { texto: 'Neve fraca', icone: 'neve', fundo: 'neve' },
  73: { texto: 'Nevando', icone: 'neve', fundo: 'neve' },
  75: { texto: 'Neve forte', icone: 'neve', fundo: 'neve' },
  77: { texto: 'Grãos de neve', icone: 'neve', fundo: 'neve' },
  80: { texto: 'Pancadas de chuva', icone: 'chuva', fundo: 'chuva' },
  81: { texto: 'Pancadas de chuva fortes', icone: 'chuva', fundo: 'chuva' },
  82: { texto: 'Pancadas de chuva violentas', icone: 'tempestade', fundo: 'chuva' },
  85: { texto: 'Pancadas de neve', icone: 'neve', fundo: 'neve' },
  86: { texto: 'Pancadas de neve fortes', icone: 'neve', fundo: 'neve' },
  95: { texto: 'Trovoada', icone: 'tempestade', fundo: 'chuva' },
  96: { texto: 'Trovoada com granizo', icone: 'tempestade', fundo: 'chuva' },
  99: { texto: 'Trovoada com granizo forte', icone: 'tempestade', fundo: 'chuva' },
}

const DESCONHECIDO: Descricao = { texto: 'Tempo indefinido', icone: 'nublado', fundo: 'sol' }

// À noite (is_day = 0): fundo de noite, exceto se estiver chovendo ou nevando; céu limpo
// mostra a lua, e "Ensolarado" vira "Céu limpo".
export function descreverTempo(codigo: number, ehDia = true): Descricao {
  const base = CODIGOS[codigo] ?? DESCONHECIDO
  if (ehDia) return base

  const precipitando = base.fundo === 'chuva' || base.fundo === 'neve'
  return {
    texto: codigo === 0 ? 'Céu limpo' : base.texto,
    icone: codigo <= 1 ? 'lua' : codigo === 2 ? 'nublado' : base.icone,
    fundo: precipitando ? base.fundo : 'noite',
  }
}
