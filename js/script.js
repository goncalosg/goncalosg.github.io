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

// animação entrada
  window.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("gg-loader");
  const typeEl = document.querySelector(".gg-type");
  const keepEl = document.querySelector(".gg-keep");

  console.log("[gg] loader?", !!loader, "type?", !!typeEl, "keep?", !!keepEl);
  console.log("[gg] reduced motion?", window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  if (!loader || !typeEl || !keepEl) return;

  // ===== SCROLL LOCK =====
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.style.setProperty("--gg-scroll-top", `-${scrollY}px`);
  document.documentElement.classList.add("gg-lock");
  document.body.classList.add("gg-lock");

  // ===== Split letras =====
  const text = typeEl.textContent.trim();
  typeEl.textContent = "";

  // manter 1ª letra de cada palavra (2 palavras => 2 iniciais)
  const words = text.split(/\s+/);
  const keepPositions = [];
  let pos = 0;
  for (let i = 0; i < words.length; i++) {
    keepPositions.push(pos);            // primeira letra da palavra
    pos += words[i].length + 1;         // + espaço
  }
  const keepSet = new Set(keepPositions);

  const spans = [];
  [...text].forEach((ch, i) => {
    const s = document.createElement("span");
    s.className = "gg-char";
    if (ch === " ") {
  s.textContent = "\u00A0";
  s.style.marginRight = "0.6em"; // controla o espaço aqui
  s.dataset.space = "1";
} else {
  s.textContent = ch;
}

    if (keepSet.has(i)) s.dataset.keep = "1";
    if (ch === " ") s.dataset.space = "1";

    typeEl.appendChild(s);
    spans.push(s);
  });

  // Só 2 iniciais (primeiras 2 palavras)
  const keptLetters = spans.filter(s => s.dataset.keep === "1").map(s => s.textContent);
  keepEl.querySelector(".gg-keep-left").textContent = keptLetters[0] || "G";
  keepEl.querySelector(".gg-keep-right").textContent = keptLetters[1] || "G";

  // ===== Timeline =====
  const startFadeAt = 700; // nome aparece logo
  const step = 45;
  const dur = 260;

  setTimeout(() => {
    loader.classList.add("gg-fade");

    let order = 0;
    spans.forEach((s) => {
      if (s.dataset.space === "1") return;
      if (s.dataset.keep === "1") return;

      s.style.setProperty("--gg-delay", `${order * step}ms`);
      s.style.setProperty("--gg-dur", `${dur}ms`);
      order++;
    });

    const fadeTotal = (order * step) + dur + 150;

    setTimeout(() => loader.classList.add("gg-merge"), fadeTotal);

    setTimeout(() => {
  loader.classList.add("gg-exit");
  document.body.classList.add("gg-visible");

  // ✅ desbloqueia já aqui
  document.documentElement.classList.remove("gg-lock");
  document.body.classList.remove("gg-lock");
  document.body.style.removeProperty("--gg-scroll-top");
  window.scrollTo(0, scrollY);
}, fadeTotal + 900);

// ✅ remover só o overlay depois, mas sem bloquear o site
setTimeout(() => {
  loader.remove();
}, fadeTotal + 900 + 950);

  }, startFadeAt);
});

// animação opacity
const DURATION = 600; // 800ms = 0.8s

// Fade in
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-enter");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove("page-enter");
    });
  });
});

// Fade out
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const url = new URL(link.href, window.location.href);

  if (url.origin !== window.location.origin) return;
  if (link.target === "_blank") return;
  if (link.hasAttribute("download")) return;
  if (url.pathname === window.location.pathname) return;

  e.preventDefault();

  document.body.classList.add("page-exit");

  setTimeout(() => {
    window.location.href = url.href;
  }, DURATION);
});