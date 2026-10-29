// Quem fez o site e os links pessoais. Pra trocar um link, o nome ou a frase, mexa só aqui:
// a seção QUEM FEZ/ e o rodapé leem daqui.

export const AUTOR = {
  nome: 'Matheus Pereira',
  frase:
    'Estudante de Análise e Desenvolvimento de Sistemas no IFNMG. Criei o PixelClima com React, Three.js e Blender.',
}

export type Rede = { nome: string; url: string }

// a ordem aqui é a ordem na tela
export const REDES: Rede[] = [
  { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/matheus-pereira-28b312350' },
  { nome: 'GitHub', url: 'https://github.com/Matheusmpodev' },
  { nome: 'Instagram', url: 'https://www.instagram.com/matheus_mpo' },
]
