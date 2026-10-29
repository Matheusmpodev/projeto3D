import './abertura.css'

// Visível durante o corredor: leva direto ao conteúdo.
export function BotaoPular({ onPular }: { onPular: () => void }) {
  return (
    <button type="button" className="botao-pular" onClick={onPular}>
      Pular <span aria-hidden="true">›</span>
    </button>
  )
}
