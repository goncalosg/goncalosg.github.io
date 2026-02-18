// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Animação para .intro-description a
  const introLink = document.querySelector('.intro-description a');

   // Verifica se o link existe antes de adicionar os listeners
  if (introLink) {
    // Quando o rato entra no link, aplica a classe de animação de entrada
    introLink.addEventListener('mouseenter', () => {
      introLink.classList.remove('animate-out'); // Tira a animação de saída
      introLink.classList.add('animate-in'); // Adiciona a animação de entrada
    });

    // Quando o rato sai do link, aplica a classe de animação de saída
    introLink.addEventListener('mouseleave', () => {
      introLink.classList.remove('animate-in');
      introLink.classList.add('animate-out');
    });
  }

  const projectLink = document.querySelector('.project-title a');
  if (projectLink) {
    projectLink.addEventListener('mouseenter', () => {
      projectLink.classList.remove('animate-out');
      projectLink.classList.add('animate-in');
    });
    projectLink.addEventListener('mouseleave', () => {
      projectLink.classList.remove('animate-in');
      projectLink.classList.add('animate-out');
    });
  }

  const animatedText = document.querySelector('.nextimage p');

if (animatedText) {
  animatedText.addEventListener('mouseenter', () => {
    animatedText.classList.remove('animate-out');
    animatedText.classList.add('animate-in');
  });

  animatedText.addEventListener('mouseleave', () => {
    animatedText.classList.remove('animate-in');
    animatedText.classList.add('animate-out');
  });
}


  // Locomotive Scroll

  // Define a posição atual do scroll
let scrollAmount = window.scrollY || 0;

// Define a posição desejada (alvo) do scroll
let targetScroll = scrollAmount;

// Flag para saber se está atualmente a decorrer uma animação de scroll
let isScrolling = false;

// Adiciona um listener ao evento de scroll via rato (roda do rato)
window.addEventListener('wheel', function(event) {
  event.preventDefault();  // Evita scroll padrão

   // Atualiza o valor alvo do scroll com base na direção e intensidade do movimento da roda
  targetScroll += event.deltaY;
  
  // Garante que não se ultrapassa o topo ou o fundo da página ao dar scroll
  targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
  
   // Se não estiver já a fazer scroll suave, inicia a animação
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(smoothScroll);
  }
}, { passive: false }); // Define como não passivo para permitir o uso de preventDefault()

// Função que executa o scroll suave
function smoothScroll() {
  // Aproxima progressivamente o scroll atual do valor alvo
  scrollAmount += (targetScroll - scrollAmount) * 0.09; // acelera a interpolação

  // Move o scroll da janela para a nova posição interpolada
  window.scrollTo(0, scrollAmount);

  // Se ainda estiver longe o suficiente do destino, continua a animar
  if (Math.abs(scrollAmount - targetScroll) > 0.5) {
    requestAnimationFrame(smoothScroll); // Continua o loop de animação
  } else {
    isScrolling = false; // Termina a animação quando chega perto do alvo
  }
}

function buildSwapTitle(el){
  const topText = el.textContent.trim();
  const bottomText = (el.dataset.hover || topText).trim();

  const makeLine = (text, cls) => {
    const line = document.createElement("span");
    line.className = `line ${cls}`;

    const content = document.createElement("span");
    content.className = "content";

    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.transitionDelay = `${i * 0.025}s`;
      content.appendChild(s);
    });

    line.appendChild(content);
    return line;
  };

  const lines = document.createElement("span");
  lines.className = "lines";

  const topLine = makeLine(topText, "top");
  const bottomLine = makeLine(bottomText, "bottom");

  lines.appendChild(topLine);
  lines.appendChild(bottomLine);

  el.textContent = "";
  el.appendChild(lines);

  const topContent = topLine.querySelector(".content");
  const bottomContent = bottomLine.querySelector(".content");

  const update = () => {
    // altura segura
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    lines.style.height = `${fs * 1.25}px`;

    // medir larguras REAIS do texto (content)
    const topW = topContent.getBoundingClientRect().width;
    const botW = bottomContent.getBoundingClientRect().width;

    const wMax = Math.max(topW, botW);

    // janela sempre grande o suficiente (evita corte)
    el.style.setProperty("--wmax", `${wMax}px`);

    // underline por frase
    el.style.setProperty("--u", `${topW}px`);
    el.style.setProperty("--u-hover", `${botW}px`);
  };

  const scheduleUpdate = () => {
    update();
    requestAnimationFrame(update);
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleUpdate);
  } else {
    scheduleUpdate();
    setTimeout(update, 100);
  }

  window.addEventListener("resize", update);
}

document.querySelectorAll(".swap-title").forEach(buildSwapTitle);

});
