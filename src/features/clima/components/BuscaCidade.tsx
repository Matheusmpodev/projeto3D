import { useEffect, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from 'react'
import { buscarCidades } from '../services/openMeteo'
import type { Lugar } from '../tipos'

const ESPERA_DIGITACAO = 350 // ms sem digitar antes de buscar (debounce)
const MINIMO_DE_LETRAS = 2

// resultado marcado com o termo buscado: se o texto mudou, o resultado antigo não aparece
type Resultado = { termo: string; lugares?: Lugar[]; erro?: true }

// "Ilhéus, Bahia, Brasil": o município só aparece se for diferente do nome (senão repetiria)
const descricaoDoLugar = (l: Lugar) =>
  [l.municipio !== l.nome && l.municipio, l.regiao, l.pais].filter(Boolean).join(', ')

// Busca de cidade: sugere até 5 cidades enquanto digita; escolher uma carrega o clima dela.
export function BuscaCidade({ onEscolher }: { onEscolher: (lugar: Lugar) => void }) {
  const [texto, setTexto] = useState('')
  const [aberta, setAberta] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const termo = texto.trim()

  // busca depois de uma pausa na digitação, cancelando a busca anterior que ainda não voltou
  useEffect(() => {
    if (termo.length < MINIMO_DE_LETRAS) return
    const controle = new AbortController()
    const espera = setTimeout(() => {
      buscarCidades(termo, controle.signal).then(
        (lugares) => setResultado({ termo, lugares }),
        () => {
          if (!controle.signal.aborted) setResultado({ termo, erro: true })
        },
      )
    }, ESPERA_DIGITACAO)
    return () => {
      clearTimeout(espera)
      controle.abort()
    }
  }, [termo])

  const atual = resultado?.termo === termo ? resultado : null
  const mostrarLista = aberta && termo.length >= MINIMO_DE_LETRAS

  const escolher = (lugar: Lugar) => {
    onEscolher(lugar)
    setTexto('')
    setAberta(false)
  }

  // BUSCAR (ou Enter): escolhe a primeira sugestão; se ainda não chegou, só mostra a lista
  const buscar = (e: FormEvent) => {
    e.preventDefault()
    const primeira = atual?.lugares?.[0]
    if (primeira) escolher(primeira)
    else setAberta(true)
  }

  // fecha a lista quando o foco sai do formulário (mas não ao clicar numa sugestão)
  const aoSairDoFoco = (e: FocusEvent<HTMLFormElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setAberta(false)
  }

  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setAberta(false)
  }

  return (
    <form className="busca-cidade" role="search" onSubmit={buscar} onBlur={aoSairDoFoco} onKeyDown={aoTeclar}>
      <div className="busca-linha">
        <label htmlFor="cidade" className="so-leitor">
          Buscar outra cidade
        </label>
        <input
          id="cidade"
          type="search"
          placeholder="Buscar outra cidade"
          autoComplete="off"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setAberta(true)
          }}
          onFocus={() => setAberta(true)}
          aria-controls="sugestoes-cidade"
          aria-expanded={mostrarLista}
        />
        <button type="submit" className="botao-limao">
          BUSCAR
        </button>
      </div>

      {mostrarLista && (
        <div id="sugestoes-cidade" className="sugestoes borda-pixel">
          {!atual ? (
            <p className="sugestoes-aviso" role="status">
              Buscando…
            </p>
          ) : atual.erro ? (
            <p className="sugestoes-aviso" role="status">
              Não foi possível buscar agora.
            </p>
          ) : atual.lugares?.length === 0 ? (
            <p className="sugestoes-aviso" role="status">
              Nenhuma cidade encontrada.
            </p>
          ) : (
            <ul>
              {atual.lugares?.map((l) => (
                <li key={`${l.latitude},${l.longitude}`}>
                  <button type="button" onClick={() => escolher(l)}>
                    <span className="sugestao-nome">{l.nome}</span>
                    <span className="sugestao-regiao">{descricaoDoLugar(l)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  )
}
