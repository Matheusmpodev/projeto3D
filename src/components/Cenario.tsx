import { useLayoutEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCenaGLTF } from './useCenaGLTF'
import { avancarVento, balancarComVento } from './vento'

// nomes dos objetos e materiais como estão no Blender
const SEM_SOMBRA = ['FundoPorta', 'FundoJanelas', 'FeixesLuz', 'Poeira']
const PROJETA_SOMBRA = ['Paredes', 'Teto', 'Vigas', 'CopaArvore', 'Janelas', 'Cortinas', 'Cadeiras', 'GalhoOutono', 'Palmeira', 'Arbustos']
const BALANCA: Record<string, number> = { Grama1: 0.12, Grama2: 0.12, Grama3: 0.12, FolhaPalma: 0.03 }
// multiplica o brilho só destes objetos, pra passarem do limiar do Bloom (ver PosProcessamento.tsx);
// FundoPorta = luz do fim do corredor, CeuBuraco = céu visto pelo buraco do teto.
// FundoJanelas fica de fora de propósito: não deve ativar o Bloom
const REFORCO_BRILHO: Record<string, number> = { FundoPorta: 3.5, CeuBuraco: 2 }
// Era 0.06 sem pós-processamento. Com o EffectComposer o feixe soma luz em HDR, antes do tone
// mapping (sem ele, somava depois, já limitado a 1), então precisa de bem menos opacidade
// pra ter o mesmo brilho de antes
const OPACIDADE_FEIXES = 0.025

// nome do objeto do Blender (malhas com vários materiais viram um grupo com filhos)
function nomeDoObjeto(o: THREE.Object3D, raiz: THREE.Object3D) {
  return o.parent && o.parent !== raiz ? o.parent.name : o.name
}

// extras do Blender { assado, fator_luz } ficam no userData do objeto,
// ou no do pai quando a malha tem vários materiais e vira um grupo
function fatorDeLuzAssada(o: THREE.Object3D): number | null {
  for (const alvo of [o, o.parent]) {
    if (alvo?.userData.assado) return alvo.userData.fator_luz ?? 1
  }
  return null
}

// A luz já está pintada nas cores dos vértices (divididas pelo fator no Blender para caber
// no glTF); o material só multiplica de volta, sem calcular luz nem sombra em tempo real.
function materialAssado(original: THREE.Material, fator: number) {
  if (original.userData.assado) return original // já trocado (StrictMode/HMR rodam isso de novo)
  const m = new THREE.MeshBasicMaterial({
    name: original.name,
    vertexColors: true,
    // textura fotográfica (reboco/concreto) do Blender: o detalhe vem dela, a luz vem das cores dos vértices
    map: original instanceof THREE.MeshStandardMaterial ? original.map : null,
    color: new THREE.Color().setScalar(fator),
    side: original.side,
    fog: true,
  })
  m.userData.assado = true
  original.dispose()
  return m
}

// Sempre parte do valor original guardado no userData, pra não acumular o reforço quando
// prepararCena roda de novo (StrictMode/HMR). Emissivo: luz própria; Basic (assado): a cor.
function reforcarBrilho(m: THREE.Material, reforco: number) {
  if (m instanceof THREE.MeshStandardMaterial) {
    m.userData.emissivoOriginal ??= m.emissiveIntensity
    m.emissiveIntensity = m.userData.emissivoOriginal * reforco
  } else if (m instanceof THREE.MeshBasicMaterial) {
    m.userData.corOriginal ??= m.color.clone()
    m.color.copy(m.userData.corOriginal).multiplyScalar(reforco)
  }
}

// sombras e materiais especiais, igual ao protótipo
function prepararCena(raiz: THREE.Object3D) {
  raiz.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return
    const nome = nomeDoObjeto(o, raiz)
    const fator = fatorDeLuzAssada(o)
    o.receiveShadow = fator === null && !SEM_SOMBRA.includes(nome) // assados: a sombra já está na cor
    o.castShadow = PROJETA_SOMBRA.includes(nome) // Paredes e Teto continuam sombreando a grama

    if (fator !== null) {
      o.material = Array.isArray(o.material)
        ? o.material.map((m) => materialAssado(m, fator))
        : materialAssado(o.material, fator)
    }

    const mats: THREE.Material[] = Array.isArray(o.material) ? o.material : [o.material]
    for (const m of mats) {
      if (m.name === 'FeixeLuz') {
        // feixes de luz "falsos": somam brilho e não escondem o que está atrás
        Object.assign(m, {
          transparent: true,
          opacity: OPACIDADE_FEIXES,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      }
      if (nome in REFORCO_BRILHO) reforcarBrilho(m, REFORCO_BRILHO[nome])
      if (m.name in BALANCA) balancarComVento(m, BALANCA[m.name])
      if (/^(Grama|Folha|Hera|Cortina)/.test(m.name)) m.side = THREE.DoubleSide
    }
  })
}

function flutuar(poeira: THREE.Object3D | undefined, tempo: number) {
  if (poeira) poeira.position.y = Math.sin(tempo * 0.5) * 0.06
}

// O corredor do Blender: carrega o .glb, ajusta os materiais e anima grama e poeira.
export function Cenario() {
  const { scene } = useCenaGLTF()
  const poeira = useMemo(() => scene.getObjectByName('Poeira'), [scene])

  useLayoutEffect(() => prepararCena(scene), [scene])

  useFrame((_, delta) => flutuar(poeira, avancarVento(delta)))

  return <primitive object={scene} />
}
