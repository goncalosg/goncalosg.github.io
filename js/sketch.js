let cursor_element;
let current_x = 0, current_y = 0;
let target_x = 0, target_y = 0;

let cursor_size = 20;
let target_size = 20;

let target_text = "";

function setup() {
  noCanvas();

  cursor_element = select("#meu_cursor");
  cursor_element.show();

  // garante fixed
  cursor_element.elt.style.position = "fixed";
  cursor_element.elt.style.pointerEvents = "none";
  cursor_element.elt.style.display = "flex";
  cursor_element.elt.style.alignItems = "center";
  cursor_element.elt.style.justifyContent = "center";

  // listeners globais (apanha links criados depois também)
  document.addEventListener("mouseover", (e) => {
    const a = e.target.closest("a, button");
    if (!a) return;

    if (a.classList.contains("cursor-view")) {
      target_size = 70;
      target_text = "View";
    } else {
      target_size = 50;
      target_text = "";
    }
  });

  document.addEventListener("mouseout", (e) => {
    const a = e.target.closest("a, button");
    if (!a) return;

    target_size = 20;
    target_text = "";
  });
}

function draw() {
  target_x = mouseX;
  target_y = mouseY;

  current_x = lerp(current_x, target_x, 0.2);
  current_y = lerp(current_y, target_y, 0.2);
  cursor_size = lerp(cursor_size, target_size, 0.2);

  cursor_element.size(cursor_size, cursor_size);
  cursor_element.style("border-radius", (cursor_size / 2) + "px");

  // texto no centro
  cursor_element.html(target_text);

  // move sem quebrar o fixed
  cursor_element.elt.style.left = (current_x - cursor_size / 2) + "px";
  cursor_element.elt.style.top  = (current_y - cursor_size / 2) + "px";
}