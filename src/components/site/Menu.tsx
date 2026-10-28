import { Icone } from './Icone'

// Menu no topo do hero. No celular os links descem pra uma segunda linha.
export function Menu({ onReverEntrada }: { onReverEntrada: () => void }) {
  return (
    <header className="menu">
      <span className="menu-logo">
        <Icone nome="folha" tamanho={28} />
        PIXELCLIMA
      </span>
      <nav className="menu-links" aria-label="Seções">
        <a href="#agora">Agora</a>
        <a href="#previsao">Previsão</a>
        <a href="#qualidade-do-ar">Qualidade do ar</a>
      </nav>
      <button type="button" className="botao-limao" onClick={onReverEntrada}>
        <span aria-hidden="true">↺</span> Rever a entrada
      </button>
    </header>
  )
}
