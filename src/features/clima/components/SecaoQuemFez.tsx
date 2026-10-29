import { LinkDaRede } from './LinkDaRede'
import { AUTOR, REDES } from '../lib/contato'

// Seção QUEM FEZ/: nome, uma frase e os links pessoais em botões grandes (dados em lib/contato.ts).
export function SecaoQuemFez() {
  return (
    <section id="quem-fez" className="secao" aria-labelledby="titulo-quem-fez">
      <h2 id="titulo-quem-fez" className="secao-titulo">
        QUEM FEZ<span aria-hidden="true">/</span>
      </h2>
      <p className="quem-fez-nome">{AUTOR.nome}</p>
      <p className="quem-fez-frase">{AUTOR.frase}</p>
      <ul className="links-pessoais">
        {REDES.map((rede) => (
          <li key={rede.nome}>
            <LinkDaRede rede={rede} className="botao-rede">
              {rede.nome.toUpperCase()} <span aria-hidden="true">↗</span>
            </LinkDaRede>
          </li>
        ))}
      </ul>
    </section>
  )
}
