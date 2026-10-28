import type { DadosDoClima } from './tipos'

// DADOS FALSOS da etapa de visual. Não são mais usados (o site agora lê a Open-Meteo);
// ficam só como exemplo do formato DadosDoClima.
export const DADOS_DE_EXEMPLO: DadosDoClima = {
  cidade: 'São Paulo',
  atualizadoEm: '2026-10-28T14:30:00',
  clima: 'sol',
  icone: 'sol',
  condicao: 'Ensolarado',
  temperatura: 29,
  maxima: 31,
  minima: 19,
  sensacao: 31,
  chuva: { milimetros: 0.4, probabilidade: 10 },
  umidade: 48,
  vento: { kmh: 14, direcaoGraus: 45 },
  indiceUV: 8,
  qualidadeDoAr: 42,
  previsao: [
    { data: '2026-10-28', icone: 'sol', maxima: 31, minima: 19 },
    { data: '2026-10-29', icone: 'parcial', maxima: 29, minima: 18 },
    { data: '2026-10-30', icone: 'nublado', maxima: 26, minima: 18 },
    { data: '2026-10-31', icone: 'chuva', maxima: 22, minima: 16 },
    { data: '2026-11-01', icone: 'tempestade', maxima: 21, minima: 15 },
    { data: '2026-11-02', icone: 'parcial', maxima: 25, minima: 16 },
    { data: '2026-11-03', icone: 'sol', maxima: 28, minima: 17 },
  ],
}
