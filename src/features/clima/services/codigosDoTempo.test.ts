import { describe, expect, it } from 'vitest'
import { descreverTempo } from './codigosDoTempo'

describe('descreverTempo', () => {
  it('traduz códigos conhecidos de dia', () => {
    expect(descreverTempo(0)).toEqual({ texto: 'Ensolarado', icone: 'sol', fundo: 'sol' })
    expect(descreverTempo(3)).toEqual({ texto: 'Nublado', icone: 'nublado', fundo: 'sol' })
    expect(descreverTempo(63)).toEqual({ texto: 'Chuva', icone: 'chuva', fundo: 'chuva' })
    expect(descreverTempo(75)).toEqual({ texto: 'Neve forte', icone: 'neve', fundo: 'neve' })
    expect(descreverTempo(95)).toEqual({ texto: 'Trovoada', icone: 'tempestade', fundo: 'chuva' })
  })

  it('usa "Tempo indefinido" para código desconhecido', () => {
    expect(descreverTempo(42)).toEqual({ texto: 'Tempo indefinido', icone: 'nublado', fundo: 'sol' })
  })

  it('código desconhecido à noite usa o fundo de noite', () => {
    expect(descreverTempo(42, false).fundo).toBe('noite')
  })

  it('noite com céu limpo: "Céu limpo", lua e fundo de noite', () => {
    expect(descreverTempo(0, false)).toEqual({ texto: 'Céu limpo', icone: 'lua', fundo: 'noite' })
  })

  it('noite com poucas nuvens também mostra a lua; parcialmente nublado mostra nuvem', () => {
    expect(descreverTempo(1, false).icone).toBe('lua')
    expect(descreverTempo(2, false).icone).toBe('nublado')
  })

  it('noite com chuva ou neve mantém o fundo de chuva ou neve (o de noite não mostra a chuva)', () => {
    expect(descreverTempo(63, false)).toEqual({ texto: 'Chuva', icone: 'chuva', fundo: 'chuva' })
    expect(descreverTempo(95, false).fundo).toBe('chuva')
    expect(descreverTempo(73, false).fundo).toBe('neve')
  })
})
