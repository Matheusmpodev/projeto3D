export function Rodape() {
  return (
    <footer className="rodape">
      <p>
        Dados do clima:{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
      </p>
      {/* remover quando a API estiver ligada */}
      <p className="rodape-aviso">Por enquanto, dados de exemplo.</p>
    </footer>
  )
}
