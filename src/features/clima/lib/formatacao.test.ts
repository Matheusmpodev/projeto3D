import { describe, expect, it } from 'vitest'
import {
  classificarAr,
  classificarUV,
  dataEHora,
  diaDaSemana,
  direcaoDoVento,
  graus,
  notaDeUmidade,
  numero,
} from './formatacao'

describe('números', () => {
  it('numero usa vírgula decimal e no máximo 1 casa', () => {
    expect(numero(2.25)).toBe('2,3')
    expect(numero(12)).toBe('12')
  })

  it('graus arredonda e põe o símbolo', () => {
    expect(graus(24.6)).toBe('25°')
    expect(graus(-3.6)).toBe('-4°')
    expect(graus(-0.4)).toBe('0°') // Math.round dá -0, mas na tela não aparece "-0°"
  })
})

describe('datas', () => {
  // a Open-Meteo manda a hora local da cidade sem fuso: o resultado não depende do fuso de quem roda o teste
  it('dataEHora escreve o dia da semana, a data e a hora', () => {
    expect(dataEHora('2026-10-28T17:15')).toBe('quarta-feira, 28 de outubro · 17:15')
  })

  it('diaDaSemana: o primeiro é HOJE, os outros são abreviados sem ponto', () => {
    expect(diaDaSemana('2026-10-28', 0)).toBe('HOJE')
    expect(diaDaSemana('2026-10-29', 1)).toBe('QUI')
    expect(diaDaSemana('2026-11-01', 4)).toBe('DOM')
  })
})

describe('direcaoDoVento', () => {
  it.each([
    [0, 'norte'],
    [45, 'nordeste'],
    [90, 'leste'],
    [180, 'sul'],
    [270, 'oeste'],
    [337, 'noroeste'],
    [350, 'norte'], // arredonda pro mais perto, dando a volta no 360
    [-90, 'oeste'], // ângulo negativo
    [720, 'norte'], // mais de uma volta
  ])('%i° → %s', (grausDoVento, esperado) => {
    expect(direcaoDoVento(grausDoVento)).toBe(esperado)
  })
})

describe('classificações', () => {
  it('classificarUV segue as faixas da OMS (o limite fica na faixa de cima)', () => {
    expect(classificarUV(2.9)).toBe('Baixo')
    expect(classificarUV(3)).toBe('Moderado')
    expect(classificarUV(6)).toBe('Alto — use protetor')
    expect(classificarUV(8)).toBe('Muito alto — evite o sol')
    expect(classificarUV(11)).toBe('Extremo — evite o sol')
  })

  it('classificarAr segue as faixas do AQI americano (o limite fica na faixa de baixo)', () => {
    expect(classificarAr(50)).toBe('Boa')
    expect(classificarAr(51)).toBe('Moderada')
    expect(classificarAr(150)).toBe('Ruim para sensíveis')
    expect(classificarAr(200)).toBe('Ruim')
    expect(classificarAr(300)).toBe('Muito ruim')
    expect(classificarAr(301)).toBe('Perigosa')
  })

  it('notaDeUmidade', () => {
    expect(notaDeUmidade(29)).toBe('Ar seco — beba água')
    expect(notaDeUmidade(60)).toBe('Confortável')
    expect(notaDeUmidade(61)).toBe('Ar úmido')
  })
})
