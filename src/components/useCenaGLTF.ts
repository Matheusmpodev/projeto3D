import { useGLTF } from '@react-three/drei'

// BASE_URL respeita o "base" do vite.config (útil se o site for publicado numa subpasta)
export const URL_CENA = `${import.meta.env.BASE_URL}cena.glb`

// Um único ponto de acesso ao .glb. O useGLTF guarda o resultado em cache,
// então Cenario e CameraDoBlender recebem exatamente os mesmos objetos.
// O Draco vem ligado por padrão (decoder baixado do CDN do Google).
export function useCenaGLTF() {
  return useGLTF(URL_CENA)
}

// começa o download assim que o módulo é importado, antes do Canvas montar
useGLTF.preload(URL_CENA)
