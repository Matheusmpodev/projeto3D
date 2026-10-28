import { urlDoIcone, type NomeDoIcone } from './imagens'

// Ícone pixel art de public/clima/. Decorativo por padrão (alt vazio): o texto ao lado já diz o que é.
export function Icone({ nome, tamanho, alt = '' }: { nome: NomeDoIcone; tamanho: number; alt?: string }) {
  return <img className="icone-pixel" src={urlDoIcone(nome)} width={tamanho} height={tamanho} alt={alt} />
}
