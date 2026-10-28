import type { Lugar } from '../components/site/tipos'

// De onde vem o lugar inicial: a última cidade escolhida (localStorage), a posição do
// navegador ou, se nada disso der certo, Montes Claros.

export const MONTES_CLAROS: Lugar = {
  nome: 'Montes Claros',
  regiao: 'Minas Gerais',
  pais: 'Brasil',
  latitude: -16.735,
  longitude: -43.86167,
}

const CHAVE_SALVA = 'lado-de-fora:cidade'

// se a pessoa não responder ao pedido de localização, não dá pra esperar para sempre
const ESPERA_PELA_PERMISSAO = 12_000

function ehLugar(valor: unknown): valor is Lugar {
  const l = valor as Lugar
  return typeof l?.nome === 'string' && typeof l.latitude === 'number' && typeof l.longitude === 'number'
}

// localStorage pode falhar (modo privado, armazenamento bloqueado ou cheio) e o conteúdo pode
// estar corrompido: em qualquer caso, só não lembra da cidade
export function lerLugarSalvo(): Lugar | null {
  try {
    const texto = localStorage.getItem(CHAVE_SALVA)
    const valor: unknown = texto ? JSON.parse(texto) : null
    return ehLugar(valor) ? valor : null
  } catch {
    return null
  }
}

export function salvarLugar(lugar: Lugar) {
  try {
    localStorage.setItem(CHAVE_SALVA, JSON.stringify(lugar))
  } catch {
    // sem armazenamento: a escolha vale só até recarregar a página
  }
}

// Posição do navegador. Nunca rejeita: em caso de recusa, erro, falta de suporte ou demora,
// resolve com Montes Claros. A Open-Meteo não tem busca reversa (coordenada → nome), então
// a posição aparece como "Sua localização".
export function obterLocalizacao(): Promise<Lugar> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(MONTES_CLAROS)

    const desistir = setTimeout(() => resolve(MONTES_CLAROS), ESPERA_PELA_PERMISSAO)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        clearTimeout(desistir)
        resolve({ nome: 'Sua localização', latitude: coords.latitude, longitude: coords.longitude })
      },
      () => {
        clearTimeout(desistir)
        resolve(MONTES_CLAROS)
      },
      { timeout: 10_000, maximumAge: 10 * 60_000 },
    )
  })
}
