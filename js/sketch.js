    // Gonçalo Gomes, Nº 3220794
    // Exercício de avaliação - Portfólio
    // Ano letivo - 3º ano, 2024-2025
    // 2º Semestre
    // Laboratório de Projeto II
    // Design Gráfico e Multimédia
    // Escola Superior de Artes e Design - Instituto Politécnico de Leiria
    // Docente: Marco Heleno
    // Data de avaliação: 08⁄Junho⁄2025

// Declaração de variáveis globais
let cursor_element; // elemento HTML que representa o cursor personalizado
let current_x = 0;
let current_y = 0;
let target_x = 0;
let target_y = 0;
let cursor_size = 20;
let target_size = 20;

function setup() {
  noCanvas(); // não desenha um canvas do p5

  cursor_element = select("#meu_cursor");
  cursor_element.show();

  // Hover aumenta cursor
  const hoverElements = selectAll('a, button'); // podes adicionar classes personalizadas

   // Para cada elemento desses, adiciona um comportamento ao passar o rato por cima (hover)
  hoverElements.forEach(el => {
    el.mouseOver(() => {
      target_size = 50; // aumenta o tamanho do cursor
    });
    el.mouseOut(() => {
      target_size = 20; // volta ao normal
    });
  });
}

function draw() {
  // Atualiza a posição alvo com a posição do rato
  target_x = mouseX;
  target_y = mouseY;

  // Lerp posição e tamanho
  current_x = lerp(current_x, target_x, 0.8);
  current_y = lerp(current_y, target_y, 0.8);
  cursor_size = lerp(cursor_size, target_size, 0.35);

  cursor_element.size(cursor_size, cursor_size);
  cursor_element.style("border-radius", cursor_size / 2 + "px");
  cursor_element.position(current_x - cursor_size / 2, current_y - cursor_size / 2, "fixed");
}
