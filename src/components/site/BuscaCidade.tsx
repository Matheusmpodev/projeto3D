import type { FormEvent } from 'react'

// Busca de cidade. Ainda não faz nada: a busca entra junto com a API Open-Meteo.
export function BuscaCidade() {
  const buscar = (e: FormEvent) => e.preventDefault()

  return (
    <form className="busca-cidade" role="search" onSubmit={buscar}>
      <label htmlFor="cidade" className="so-leitor">
        Buscar outra cidade
      </label>
      <input id="cidade" type="search" placeholder="Buscar outra cidade" autoComplete="off" />
      <button type="submit" className="botao-limao">
        BUSCAR
      </button>
    </form>
  )
}
