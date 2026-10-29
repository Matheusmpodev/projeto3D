import type { Material } from 'three'

// Relógio compartilhado por todos os materiais que balançam.
// É o mesmo objeto em todos eles, então basta avançar o tempo uma vez por quadro.
const uTempo = { value: 0 }

export function avancarVento(delta: number) {
  uTempo.value += delta
  return uTempo.value
}

// Grama balançando com o vento: mexe só no vertex shader, custo quase zero.
// A força vai num uniform (e não escrita no texto do shader, como no protótipo) porque o
// three reaproveita o programa compilado entre materiais com o mesmo onBeforeCompile;
// com o valor fixo no texto, Grama e FolhaPalma acabariam usando a mesma força.
export function balancarComVento(material: Material, forca: number) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTempo = uTempo
    shader.uniforms.uForca = { value: forca }
    shader.vertexShader =
      'uniform float uTempo;\nuniform float uForca;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float altura = max(position.y, 0.0);
        transformed.x += sin(uTempo * 1.6 + position.x * 0.9 + position.z * 0.7) * uForca * altura;
        transformed.z += cos(uTempo * 1.3 + position.x * 0.6) * uForca * 0.6 * altura;`,
      )
  }
  material.needsUpdate = true
}
