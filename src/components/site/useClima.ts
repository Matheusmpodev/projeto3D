import { useCallback, useEffect, useState } from 'react'
import { buscarClima } from '../../services/openMeteo'
import { lerLugarSalvo, obterLocalizacao, salvarLugar } from '../../services/localizacao'
import type { DadosDoClima, Lugar } from './tipos'

const QUINZE_MINUTOS = 15 * 60_000

// resultado de um pedido, marcado com a "chave" do pedido (lugar + tentativa): assim um
// resultado velho (de outra cidade) nunca aparece como se fosse o atual
type Resultado = { chave: string; dados?: DadosDoClima; erro?: string }

function mensagemDeErro() {
  return navigator.onLine ? 'Não foi possível carregar o clima agora.' : 'Sem conexão com a internet.'
}

// Estado do clima do site: qual lugar, os dados, se está carregando e se deu erro.
// Só chama a API quando o lugar muda (ou no "Tentar de novo") e, depois, a cada 15 minutos.
export function useClima() {
  // a última cidade escolhida, se houver; senão null até a geolocalização responder
  const [lugar, setLugar] = useState<Lugar | null>(lerLugarSalvo)
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  // sem cidade salva: pede a posição ao navegador (ou cai em Montes Claros)
  useEffect(() => {
    if (lugar) return
    let cancelado = false
    obterLocalizacao().then((l) => {
      if (!cancelado) setLugar(l)
    })
    return () => {
      cancelado = true
    }
  }, [lugar])

  const chave = lugar ? `${lugar.latitude},${lugar.longitude}#${tentativa}` : null

  useEffect(() => {
    if (!lugar || !chave) return
    // cancela o pedido em andamento se o lugar mudar ou o site fechar antes da resposta
    const controle = new AbortController()

    const carregar = () =>
      buscarClima(lugar, controle.signal).then(
        (dados) => setResultado({ chave, dados }),
        () => {
          if (controle.signal.aborted) return
          // numa atualização automática que falhou, mantém os dados que já estão na tela
          setResultado((atual) => (atual?.chave === chave && atual.dados ? atual : { chave, erro: mensagemDeErro() }))
        },
      )

    carregar()
    const relogio = setInterval(carregar, QUINZE_MINUTOS)
    return () => {
      controle.abort()
      clearInterval(relogio)
    }
  }, [lugar, chave])

  const escolherLugar = useCallback((novo: Lugar) => {
    salvarLugar(novo)
    setLugar(novo)
  }, [])

  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), [])

  // carregando = ainda não chegou resposta para o pedido atual (inclui esperar a localização)
  const atual = resultado?.chave === chave ? resultado : null
  return {
    lugar,
    dados: atual?.dados ?? null,
    carregando: !atual,
    erro: atual?.erro ?? null,
    escolherLugar,
    tentarDeNovo,
  }
}
