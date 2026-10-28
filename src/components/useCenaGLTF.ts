import { use } from 'react'
import { useProgress } from '@react-three/drei'
import { FileLoader, LoaderUtils } from 'three'
import { DRACO_GLTF_CONFIG, DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { comecarCarregamento, informarPercentual } from './carregamento'

// BASE_URL respeita o "base" do vite.config (útil se o site for publicado numa subpasta)
export const URL_CENA = `${import.meta.env.BASE_URL}cena.glb`

// Porcentagem da tela de carregamento.
// O useProgress da drei conta ARQUIVOS terminados (cena, decoder do Draco, texturas), não bytes.
// Como a cena.glb é um arquivo só, com ~90% do peso, ele sozinho ficaria parado em 0% durante
// quase todo o download. Então: os bytes da cena valem até 90%, os arquivos contam o resto.
const PESO_DO_DOWNLOAD = 90

// Decoder do Draco que vem dentro do pacote three (o Vite copia pro build, com hash no nome),
// em vez do CDN do Google que o useGLTF da drei usa: um servidor de fora a menos, e a versão
// do decoder sempre casa com a do three. A variante "gltf" é a menor (192 KB, só o necessário pra glTF).
const draco = new DRACOLoader().setDecoderPath(DRACO_GLTF_CONFIG)
const gltf = new GLTFLoader().setDRACOLoader(draco)

type Pedido = { promessa: Promise<GLTF>; sinal: AbortSignal; pronto: boolean }
let pedido: Pedido | null = null

// Baixa e monta a cena uma vez só e guarda a promessa (o React suspende o Cenario até ela
// terminar). É o download feito à mão, e não o useGLTF, por dois motivos: o onProgress (bytes
// baixados, pra porcentagem) e o abort (o Pular cancela o download se a cena não estiver pronta).
function carregarCena(): Promise<GLTF> {
  // reaproveita o pedido em andamento ou pronto; um cancelado começa de novo ("Rever a entrada")
  if (pedido && (pedido.pronto || !pedido.sinal.aborted)) return pedido.promessa

  const sinal = comecarCarregamento()
  draco.preload() // decoder em paralelo com a cena (senão só começaria depois do .glb chegar)
  const arquivo = new FileLoader().setResponseType('arraybuffer')
  sinal.addEventListener('abort', () => arquivo.abort())

  // o useProgress soma tudo desde que a página abriu: conta só o que entrou a partir daqui
  const antes = useProgress.getState()
  let baixado: number | null = 0 // fração 0–1 da cena; null se o servidor não informar o tamanho
  const recalcular = () => {
    const { loaded, total } = useProgress.getState()
    const novos = total - antes.total
    const arquivos = novos > 0 ? (loaded - antes.loaded) / novos : 0
    informarPercentual(
      baixado === null ? arquivos * 100 : baixado * PESO_DO_DOWNLOAD + arquivos * (100 - PESO_DO_DOWNLOAD),
    )
  }
  const pararDeOuvir = useProgress.subscribe(recalcular)

  const atual: Pedido = {
    sinal,
    pronto: false,
    promessa: new Promise((resolver, rejeitar) => {
      // Cancelado, a promessa fica pendente pra sempre em vez de rejeitar: o 3D já foi
      // desmontado e ninguém espera por ela. Rejeitar faria o Suspense mostrar um erro à toa
      const terminar = (fim: () => void) => {
        pararDeOuvir()
        if (!sinal.aborted) fim()
      }
      arquivo.load(
        URL_CENA,
        (dados) =>
          gltf.parse(
            dados as ArrayBuffer,
            LoaderUtils.extractUrlBase(URL_CENA),
            (cena) =>
              terminar(() => {
                atual.pronto = true
                resolver(cena)
              }),
            (erro) => terminar(() => rejeitar(erro)),
          ),
        (evento) => {
          baixado = evento.lengthComputable ? Math.min(1, evento.loaded / evento.total) : null
          recalcular()
        },
        (erro) => terminar(() => rejeitar(erro)),
      )
    }),
  }
  pedido = atual
  return atual.promessa
}

// Um único ponto de acesso ao .glb: Cenario e CameraDoBlender recebem exatamente os mesmos objetos.
// Precisa estar dentro de um <Suspense> (o do CenaFundo).
export function useCenaGLTF() {
  return use(carregarCena())
}
