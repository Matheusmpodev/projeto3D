import { LinkDaRede } from './LinkDaRede'
import { REDES } from '../lib/contato'

export function Rodape() {
  return (
    <footer className="rodape">
      <p>
        Dados do clima:{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir o site da Open-Meteo em nova aba"
        >
          Open-Meteo
        </a>
      </p>
      {/* os mesmos links da seção QUEM FEZ/, em versão pequena */}
      <nav aria-label="Meus links">
        <ul className="rodape-links">
          {REDES.map((rede) => (
            <li key={rede.nome}>
              <LinkDaRede rede={rede}>{rede.nome}</LinkDaRede>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}
