document.addEventListener("DOMContentLoaded", () => {
  // Elementos do áudio
  const audio = document.getElementById('bgAudio');
  let isPlaying = false;
  // ══════════════════════════
  // SISTEMA DE FUMAÇA NO CANVAS (INTRO)
  // ══════════════════════════
  const canvas = document.getElementById('intro-canvas');
  let smokeActive = true;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 45; // Quantidade balanceada de fumaça leve/nebulosa

    // Ajustar tamanho do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
      constructor() {
        this.reset();
        // Spawna posições verticais aleatórias no início para preenchimento imediato
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 140 + 90; // Partículas grandes para fumaça nebulosa difusa
        this.vx = Math.random() * 0.6 - 0.3; // Deriva horizontal suave
        this.vy = -(Math.random() * 0.9 + 0.4); // Sobe de forma lenta e orgânica
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.12 + 0.04; // Transparência muito sutil para parecer neblina suave
        this.fadeSpeed = Math.random() * 0.004 + 0.002;
        this.growthSpeed = Math.random() * 0.15 + 0.08;
        this.stage = 0; // 0 = surgindo (fadeIn), 1 = sumindo (fadeOut)
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += this.growthSpeed;

        if (this.stage === 0) {
          this.alpha += this.fadeSpeed;
          if (this.alpha >= this.maxAlpha) {
            this.alpha = this.maxAlpha;
            this.stage = 1;
          }
        } else {
          this.alpha -= this.fadeSpeed * 0.7;
          if (this.alpha <= 0) {
            this.reset();
          }
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        // Gradiente radial com dissipação nas bordas
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        // Cores de plasma de fumaça bronze/laranja
        gradient.addColorStop(0, `rgba(200, 130, 66, ${this.alpha})`);
        gradient.addColorStop(0.3, `rgba(255, 140, 0, ${this.alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(6, 5, 4, 0)');

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Criar conjunto de partículas
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new SmokeParticle());
    }

    // Loop de Animação
    const animateSmoke = () => {
      if (!smokeActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateSmoke);
    };
    animateSmoke();
  }

  // ══════════════════════════
  // ANIMAÇÃO DE INTRODUÇÃO (INTRO OVERLAY DINÂMICA PREMIUM HUD)
  // ══════════════════════════
  const introOverlay = document.getElementById('intro-overlay');
  const introTerminal = document.getElementById('introTerminal');
  const glitchLogo = document.getElementById('glitch-logo');
  const pingEl = document.getElementById('hud-ping');
  const tempEl = document.getElementById('hud-temp');
  const flowEl = document.getElementById('hud-flow');
  const decryptEl = document.getElementById('hud-decrypt');

  // Variáveis globais de boot no escopo DOMContentLoaded
  let bootInterval;
  let activeBoot = true;
  let messageIndex = 0;
  let isModSelectionInProgress = false;

  const finishBootSequence = () => {
    if (bootInterval) clearInterval(bootInterval);
    activeBoot = false;

    // Finalizar carregamento e sumir com a intro
    setTimeout(() => {
      if (introOverlay) introOverlay.classList.add('fade-out');
      // Disparar animação staggered das seções principais
      document.body.classList.add('boot-complete');

      // Carregar o vídeo de fundo
      const bgVideo = document.getElementById('video-background');
      const videoSource = document.getElementById('video-source');
      if (bgVideo && videoSource) {
        videoSource.src = videoSource.getAttribute('data-src');
        bgVideo.load();
        bgVideo.play().catch(err => console.log("Video autoplay blocked:", err));
      }

      setTimeout(() => {
        smokeActive = false; // Parar loop do canvas
        if (introOverlay) introOverlay.remove();

        // Atualizar a visibilidade dos controles MOD no dashboard principal
        updateModUIVisibility();
      }, 900);
    }, 300);
  };

  if (introOverlay) {
    // 1. Efeito Decodificador / Glitch no Logo CLOUTCH
    if (glitchLogo) {
      const targetText = "CLOUTCH";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*!?";
      let iterations = 0;
      const logoInterval = setInterval(() => {
        glitchLogo.textContent = targetText.split("").map((char, index) => {
          if (index < iterations) return targetText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");

        if (iterations >= targetText.length) {
          clearInterval(logoInterval);
        }
        iterations += 1 / 3;
      }, 35);
    }

    // 2. Estatísticas Flutuantes HUD
    const statsInterval = setInterval(() => {
      if (!activeBoot) {
        clearInterval(statsInterval);
        return;
      }
      if (pingEl) pingEl.textContent = Math.floor(Math.random() * 9) + 20;
      if (tempEl) tempEl.textContent = Math.floor(Math.random() * 5) + 39;
      if (flowEl) flowEl.textContent = (Math.random() * 5 + 95).toFixed(1) + "%";
      if (decryptEl) {
        const keys = ["0x7F2A", "0x3B8C", "0x9E1D", "0x5A4F", "0x2C7E", "0x8D3B"];
        decryptEl.textContent = keys[Math.floor(Math.random() * keys.length)];
      }
    }, 120);

    // 3. Sequência de Inicialização Dinâmica
    const bootMessages = [
      "SYSTEM INITIALIZING...",
      "CONNECTING TO OPERATOR NETWORK...",
      "DECRYPTING SECURITY CREDENTIALS...",
      "LOADING HUD VISUAL PROTOCOLS...",
      "BOOTING HOLOGRAPHIC CONSOLE...",
      "ACCESS GRANTED. BOOTING CONSOLE..."
    ];

    bootInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex >= bootMessages.length) {
        // Se o usuário selecionou MOD e está digitando a senha, não finaliza automaticamente
        if (isModSelectionInProgress) {
          clearInterval(bootInterval);
          return;
        }
        finishBootSequence();
      } else {
        if (introTerminal) {
          introTerminal.textContent = bootMessages[messageIndex];
        }
      }
    }, 280);
  }

  // Lógica de Autoplay inteligente na primeira interação
  const playAudio = () => {
    if (audio && audio.paused) {
      audio.play().then(() => {
        isPlaying = true;
      }).catch(err => {
        console.log("Autoplay aguardando interação do usuário:", err);
      });
    }
  };

  // Tenta tocar imediatamente
  playAudio();

  // Executa na primeira interação (clique ou tecla em qualquer lugar)
  document.addEventListener('click', playAudio, { once: true });
  document.addEventListener('keydown', playAudio, { once: true });

  // ══════════════════════════
  // WIDGET DE STATUS DINÂMICO (DECRYPTER TERMINAL EFFECT)
  // ══════════════════════════
  const dynamicStatusText = document.getElementById('dynamicStatusText');
  if (dynamicStatusText) {
    const statusData = [
      "OPERATOR ACTIVE",
      "SECURE LINK // 24ms",
      "SYS: OPERATIONAL",
      "LOC: 40.7128 N 74.0060 W",
      "FIREWALL: NOMINAL",
      "CLOUTCH_SECURE // READY"
    ];
    let dataIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 75;

    const typeStatus = () => {
      const currentWord = statusData[dataIndex];

      if (isDeleting) {
        // Apagando caracteres com glitch aleatório
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*!?";
        const tempText = currentWord.substring(0, charIndex - 1);
        if (charIndex > 0) {
          dynamicStatusText.textContent = tempText + (Math.random() > 0.65 ? chars[Math.floor(Math.random() * chars.length)] : "");
        } else {
          dynamicStatusText.textContent = "";
        }
        charIndex--;
        typingSpeed = 30; // Velocidade de apagar
      } else {
        // Digitando com decodificador (glitch de letra rápido)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*!?";

        dynamicStatusText.textContent = currentWord.substring(0, charIndex) + (charIndex < currentWord.length ? chars[Math.floor(Math.random() * chars.length)] : "");

        setTimeout(() => {
          dynamicStatusText.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
        }, 15);

        typingSpeed = 90;
      }

      // Troca de estados
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2500; // Tempo que a palavra fica exibida
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        dataIndex = (dataIndex + 1) % statusData.length;
        typingSpeed = 400; // Pausa antes de digitar a próxima palavra
      }

      setTimeout(typeStatus, typingSpeed);
    };

    // Iniciar efeito após o boot completo do sistema (2.2s)
    setTimeout(typeStatus, 2200);
  }

  // Emblemas otimizados do Delta Force fornecidos pelo usuário
  const dfEmblemFiles = [
    "IMG_20260701_143542.png", // 0: Boas-vindas à FD
    "Screenshot_2026-07-01-14-20-40-467_com.garena.game.df.png", // 1: Asas de Resgate
    "IMG_20260701_143528.png", // 2: Pioneiro da Linha
    "Screenshot_2026-07-01-14-21-16-787_com.garena.game.df.png", // 3: Trabalho de Equipe
    "Screenshot_2026-07-01-14-21-25-047_com.garena.game.df.png", // 4: Rosa Negra
    "Screenshot_2026-07-01-14-22-20-482_com.garena.game.df.png", // 5: Elite de Combate
    "Screenshot_2026-07-01-14-23-02-857_com.garena.game.df.png", // 6: Escudo Verde
    "Screenshot_2026-07-01-14-23-27-863_com.garena.game.df.png", // 7: Pérola do Mar
    "Screenshot_2026-07-01-14-23-44-577_com.garena.game.df.png", // 8: Sniper Fuzileiro
    "Screenshot_2026-07-01-14-24-26-561_com.garena.game.df.png", // 9: Lâmina Silenciosa
    "Screenshot_2026-07-01-14-24-41-377_com.garena.game.df.png", // 10: Lobo Cenográfico
    "Screenshot_2026-07-01-14-24-56-169_com.garena.game.df.png", // 11: Leão de Bronze
    "Screenshot_2026-07-01-14-25-33-336_com.garena.game.df.png", // 12: Engenharia Militar
    "Screenshot_2026-07-01-14-25-54-147_com.garena.game.df.png", // 13: Cavaleiro de Ferro
    "Screenshot_2026-07-01-14-28-41-731_com.garena.game.df.png", // 14: Adagas Cruzadas
    "IMG_20260701_143443.png"  // 15: Leão de Ouro
  ];

  const slicedEmblems = dfEmblemFiles.map(file => `img/emblemas/${file}`);

  if (audio) {
    audio.volume = 0.45;
  }

  // Tooltip Helper
  const tooltipEl = document.getElementById('hudTooltip');
  const setupTooltip = (element, title, desc, status) => {
    if (!tooltipEl || !element) return;

    const positionTooltip = (e) => {
      const offset = 15;
      let clientX = e.clientX;
      let clientY = e.clientY;

      // Fallback para getBoundingClientRect caso clientX/Y sejam nulos ou zero (comum em testes automatizados)
      if (clientX === undefined || clientY === undefined || (clientX === 0 && clientY === 0)) {
        const rect = element.getBoundingClientRect();
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height;
      }

      const x = clientX + offset;
      const y = clientY + offset;

      const tooltipW = tooltipEl.offsetWidth;
      const tooltipH = tooltipEl.offsetHeight;
      const windowW = window.innerWidth;
      const windowH = window.innerHeight;

      let finalX = x;
      let finalY = y;

      if (x + tooltipW > windowW) {
        finalX = clientX - tooltipW - offset;
      }
      if (y + tooltipH > windowH) {
        finalY = clientY - tooltipH - offset;
      }

      // Limitar a área útil ao container .tabs-card para que não passe da linha limitadora do painel
      const tabsCard = document.querySelector('.tabs-card');
      if (tabsCard) {
        const cardRect = tabsCard.getBoundingClientRect();

        if (finalX < cardRect.left + 10) {
          finalX = cardRect.left + 10;
        }
        if (finalX + tooltipW > cardRect.right - 10) {
          finalX = cardRect.right - tooltipW - 10;
        }
        if (finalY < cardRect.top + 10) {
          finalY = cardRect.top + 10;
        }
        if (finalY + tooltipH > cardRect.bottom - 10) {
          finalY = cardRect.bottom - tooltipH - 10;
        }
      } else {
        // Fallback para os limites gerais da viewport
        if (finalX < 10) {
          finalX = 10;
        }
        if (finalX + tooltipW > windowW - 10) {
          finalX = windowW - tooltipW - 10;
        }
        if (finalY < 10) {
          finalY = 10;
        }
        if (finalY + tooltipH > windowH - 10) {
          finalY = windowH - tooltipH - 10;
        }
      }

      tooltipEl.style.left = `${finalX}px`;
      tooltipEl.style.top = `${finalY}px`;
    };

    element.addEventListener('mouseenter', (e) => {
      let statusHtml = '';
      if (status) {
        statusHtml = `<div class="tooltip-status ${status.toLowerCase()}">${status}</div>`;
      }
      tooltipEl.innerHTML = `
        <div class="tooltip-title">${title}</div>
        <div class="tooltip-desc">${desc}</div>
        ${statusHtml}
      `;
      tooltipEl.classList.add('active');
      positionTooltip(e);
    });

    element.addEventListener('mousemove', (e) => {
      positionTooltip(e);
    });

    element.addEventListener('mouseleave', () => {
      tooltipEl.classList.remove('active');
    });
  };



  // ══════════════════════════
  // DADOS DOS JOGOS (DADOS REAIS COMPATÍVEIS E EMBLEMAS 3D)
  // ══════════════════════════
  const gameData = {
    deltaforce: {
      name: "Delta Force: Hawk Ops",
      rankTitle: "DF Pinnacle ⭐ 245",
      rankScore: "Score: 23150",
      hours: "4700h",
      battles: "11430",
      assets: "266.8M",
      extractionRate: "39.8%",
      opLevel: "60",
      titleName: "God of War T6",
      titleDesc: "Proof of reaching the highest rank in Risk Zone during Season War Albaze!",
      titles: [
        { name: "God of War T9", id: "t9", file: "Screenshot_2026-07-01-15-17-13-442_com.garena.game.df.png", desc: "Season 9 - God of War Rank" },
        { name: "God of War T8", id: "t8", file: "Screenshot_2026-07-01-15-17-50-703_com.garena.game.df.png", desc: "Season 8 - God of War Rank" },
        { name: "God of War T7", id: "t7", file: "Screenshot_2026-07-01-15-17-28-310_com.garena.game.df.png", desc: "Season 7 - God of War Rank" },
        { name: "God of War T6", id: "t6", file: "Screenshot_2026-07-01-15-18-04-634_com.garena.game.df.png", desc: "Season 6 - God of War Rank" },
        { name: "God of War T5", id: "t5", file: "Screenshot_2026-07-01-15-18-17-734_com.garena.game.df.png", desc: "Season 5 - God of War Rank" },
        { name: "God of War T4", id: "t4", file: "Screenshot_2026-07-01-15-18-32-566_com.garena.game.df.png", desc: "Season 4 - God of War Rank" }
      ],
      activeTitleId: "t6",

      // Foto de perfil oficial (local)
      avatarUrl: "img/deltaforce_avatar.jpg",

      // 6 emblemas equipados com shapes e cores (reduzido para economizar espaço e evitar overflow)
      equippedEmblems: [
        { name: "Welcome to FD", icon: "fa-crosshairs", shape: "shape-shield", color: "cyan-emb", spriteIndex: 0 },
        { name: "Rescue Wings", icon: "fa-helicopter", shape: "shape-shield", color: "cyan-emb", spriteIndex: 1 },
        { name: "Frontline Pioneer", icon: "fa-medal", shape: "shape-triangle", color: "gold-emb", spriteIndex: 2 },
        { name: "Teamwork", icon: "fa-users", shape: "shape-shield", color: "gold-emb", spriteIndex: 3 },
        { name: "Black Rose", icon: "fa-spa", shape: "shape-diamond", color: "blue-emb", spriteIndex: 4 },
        { name: "Combat Elite", icon: "fa-skull-crossbones", shape: "shape-shield", color: "red-emb", spriteIndex: 5 }
      ],

      // Todos os 16 emblemas com formas 3D e cores correspondentes à imagem do jogo
      allEmblems: [
        { name: "Welcome to FD", icon: "fa-crosshairs", equipped: true, desc: "Official Operator Registration: 04/21/2025.", shape: "shape-shield", color: "cyan-emb", spriteIndex: 0 },
        { name: "Rescue Wings", icon: "fa-helicopter", equipped: true, desc: "Tactical support and helicopter extraction.", shape: "shape-shield", color: "cyan-emb", spriteIndex: 1 },
        { name: "Frontline Pioneer", icon: "fa-font", equipped: true, desc: "Vanguard conquest on the front.", shape: "shape-triangle", color: "gold-emb", spriteIndex: 2 },
        { name: "Teamwork", icon: "fa-users", equipped: true, desc: "Active cooperation with tactical squad.", shape: "shape-shield", color: "gold-emb", spriteIndex: 3 },
        { name: "Black Rose", icon: "fa-seedling", equipped: true, desc: "Completion of stealth operations.", shape: "shape-diamond", color: "blue-emb", spriteIndex: 4 },
        { name: "Combat Elite", icon: "fa-skull-crossbones", equipped: true, desc: "Maximum lethality against hostile targets.", shape: "shape-shield", color: "red-emb", spriteIndex: 5 },
        { name: "Heart of Africa", icon: "fa-shield-halved", equipped: true, desc: "Extraction of the ultra-rare Heart of Africa diamond in the Hazard Zone.", shape: "shape-shield", color: "green-emb", spriteIndex: 6 },
        { name: "Pearl of the Sea", icon: "fa-gem", equipped: false, desc: "Successful extraction of rare treasures.", shape: "shape-circle", color: "gold-emb", spriteIndex: 7 },
        { name: "Marine Sniper", icon: "fa-bullseye", equipped: false, desc: "Long-range precision with sniper rifles.", shape: "shape-shield", color: "blue-emb", spriteIndex: 8 },
        { name: "Silent Blade", icon: "fa-slash", equipped: false, desc: "Stealthy close combat takedowns.", shape: "shape-shield", color: "blue-emb", spriteIndex: 9 },
        { name: "Lone Wolf", icon: "fa-paw", equipped: false, desc: "Solo hunting tactics.", shape: "shape-diamond", color: "gold-emb", spriteIndex: 10 },
        { name: "Bronze Lion", icon: "fa-cat", equipped: false, desc: "Defense under heavy siege.", shape: "shape-shield", color: "gold-emb", spriteIndex: 11 },
        { name: "Military Engineering", icon: "fa-gear", equipped: false, desc: "Hacking and decryption.", shape: "shape-circle", color: "gold-emb", spriteIndex: 12 },
        { name: "Iron Rider", icon: "fa-horse", equipped: false, desc: "Fast tactical mobility.", shape: "shape-diamond", color: "gold-emb", spriteIndex: 13 },
        { name: "Crossed Daggers", icon: "fa-bezier-curve", equipped: false, desc: "Coordination of pincer attacks.", shape: "shape-shield", color: "red-emb", spriteIndex: 14 },
        { name: "Golden Lion", icon: "fa-crown", equipped: false, desc: "Consecutive arena victories.", shape: "shape-shield", color: "gold-emb", spriteIndex: 15 }
      ],

      detailsStats: [
        { key: "Total Battles", val: "11430" },
        { key: "Playtime", val: "4700h" },
        { key: "Avg. Profit/Loss", val: "1.4M" },
        { key: "Total Extracted Value", val: "4.8b" },
        { key: "Mission Rewards", val: "1.8M" },
        { key: "MandelBricks Decoded", val: "122" },
        { key: "Avg. K/D Ratio", val: "13 | 3.3 | 1.9" },
        { key: "Operator Eliminations", val: "37,719" },
        { key: "Overall Accuracy", val: "35.5%" },
        { key: "Lethality Rate", val: "45.6%" },
        { key: "Extraction Rate", val: "39.8%" },
        { key: "Friendly Extraction Value", val: "18.1M" },
        { key: "Teammate Rescues", val: "832" },
        { key: "Revived Teammates", val: "832" }
      ],

      radarPoints: "100,41 155,82 135,148 66,134 27,76"
    },
    rust: {
      name: "Rust Mobile",
      rankTitle: "Alpha Survivor",
      rankScore: "Score: 9200",
      hours: "5,200h",
      battles: "854",
      opLevel: "95",
      titleName: "Supreme Glory",
      titleDesc: "Reached the top of the Hall of Fame on the global server ranking.",

      // Foto de perfil do Rust (local)
      avatarUrl: "img/avatarRust1.png",

      titles: [
        { name: "Supreme Glory", id: "tr4", file: "tituloRust4.png", desc: "Reached the top of the Hall of Fame on the global server ranking." },
        { name: "Mining Master", id: "tr2", file: "tituloRust2.png", desc: "Extracted over 1 million ore resources in a single wipe." },
        { name: "Bunker Warrior", id: "tr3", file: "tituloRust3.png", desc: "Survived and dominated the most hostile underground facilities." },
        { name: "Top Scholar - S1 Season", id: "tr1", file: "tituloRust1.png", desc: "Awarded for achieving 1st place individually on the S1 Season University Leaderboard." }
      ],
      activeTitleId: "tr4",

      equippedEmblems: [
        { name: "Demolition Expert III", file: "emblemaRust1.png" },
        { name: "Modification Expert I", file: "emblemaRust2.png" },
        { name: "Armaments Artisan I", file: "emblemaRust3.png" },
        { name: "Map Pathfinder", file: "emblemaRust4.png" },
        { name: "Legendary Architect", file: "emblemaRust5.png" },
        { name: "First Steps", file: "emblemaRust6.png" }
      ],
      allEmblems: [
        { name: "Demolition Expert III", file: "emblemaRust1.png", equipped: true, desc: "Destroy 10 tool cupboards in a single match." },
        { name: "Modification Expert I", file: "emblemaRust2.png", equipped: true, desc: "Craft 5 weapon attachments in a single match." },
        { name: "Armaments Artisan I", file: "emblemaRust3.png", equipped: true, desc: "Obtain 3 rockets of any type in a single match." },
        { name: "Map Pathfinder", file: "emblemaRust4.png", equipped: true, desc: "Explored and revealed 100% of all geographical regions on the map." },
        { name: "Legendary Architect", file: "emblemaRust5.png", equipped: true, desc: "Built and fortified an impenetrable high-quality metal base." },
        { name: "First Steps", file: "emblemaRust6.png", equipped: true, desc: "Crafted the first primitive wooden and stone tools." },
        { name: "Master Lumberjack", file: "emblemaRust7.png", equipped: true, desc: "Collected over 500,000 units of wood using industrial tools." },
        { name: "Master Hunter", file: "emblemaRust8.png", equipped: true, desc: "Hunted and harvested all dangerous wildlife on the island." },
        { name: "Barrel Destroyer", file: "emblemaRust9.png", equipped: true, desc: "Destroyed 1,000 scrap barrels along roads." },
        { name: "Valiant Vanguard I", file: "emblemaRust10.png", equipped: true, desc: "Defeat 20 different players in a single match." }
      ],
      detailsStats: [
        { key: "Total Wipes Played", val: "854" },
        { key: "Survival Hours", val: "5,200h" },
        { key: "PVP Kills", val: "3,450" },
        { key: "Raids Executed", val: "84" },
        { key: "Helicopters Shot Down", val: "123" }
      ],
      radarPoints: "100,25 168,75 140,155 60,155 32,75"
    },
    valorant: {
      name: "Valorant",
      rankTitle: "Ascendant III",
      rankScore: "Score: RR 72",
      hours: "450h",
      battles: "380 Matches",

      opLevel: "82",
      titleName: "Clutch Master",
      titleDesc: "Won 100+ rounds alone against 3+ enemies.",

      // Foto de perfil do Valorant (local)
      avatarUrl: "img/valorant_avatar.jpg",

      equippedEmblems: [
        { name: "Precision", icon: "fa-crosshairs", shape: "shape-shield", color: "red-emb" },
        { name: "Support", icon: "fa-shield-halved", shape: "shape-shield", color: "cyan-emb" },
        { name: "MVP", icon: "fa-trophy", shape: "shape-circle", color: "gold-emb" },
        { name: "Duelist", icon: "fa-skull", shape: "shape-diamond", color: "blue-emb" }
      ],
      allEmblems: [
        { name: "Precision", icon: "fa-crosshairs", equipped: true, desc: "Headshot rate above 28%.", shape: "shape-shield", color: "red-emb" },
        { name: "Support", icon: "fa-shield-halved", equipped: true, desc: "Provided 150 assists.", shape: "shape-shield", color: "cyan-emb" },
        { name: "MVP", icon: "fa-trophy", equipped: true, desc: "Earned MVP in ranked matches.", shape: "shape-circle", color: "gold-emb" },
        { name: "Duelist", icon: "fa-skull", equipped: true, desc: "Eliminated 30 enemies in a single match.", shape: "shape-diamond", color: "blue-emb" }
      ],
      detailsStats: [
        { key: "Competitive Matches", val: "380" },
        { key: "Hours Played", val: "450h" },
        { key: "Overall K/D Ratio", val: "1.28" },
        { key: "Win Rate", val: "58.4%" },
        { key: "Headshot Accuracy", val: "28.3%" },
        { key: "Average Damage Per Round", val: "152" }
      ],
      radarPoints: "100,30 162,75 142,150 64,148 30,75"
    },
    cs2: {
      name: "Counter-Strike 2",
      rankTitle: "Global Elite // Premier",
      rankScore: "Score: 18,400",
      hours: "350h",
      battles: "290 Matches",

      opLevel: "74",
      titleName: "Defusal Veteran",
      titleDesc: "Defused 50 bombs with less than 2 seconds remaining.",

      // Foto de perfil do CS2 (local)
      avatarUrl: "img/Cs2 perfil.jpg",

      equippedEmblems: [
        { name: "Tactical", icon: "fa-bomb", shape: "shape-circle", color: "gold-emb" },
        { name: "Sharpshooter", icon: "fa-bullseye", shape: "shape-shield", color: "red-emb" },
        { name: "Leader", icon: "fa-crown", shape: "shape-shield", color: "cyan-emb" },
        { name: "Defender", icon: "fa-shield", shape: "shape-diamond", color: "green-emb" }
      ],
      allEmblems: [
        { name: "Tactical", icon: "fa-bomb", equipped: true, desc: "Defused 100 bombs.", shape: "shape-circle", color: "gold-emb" },
        { name: "Sharpshooter", icon: "fa-bullseye", equipped: true, desc: "AWP ace in a single round.", shape: "shape-shield", color: "red-emb" },
        { name: "Leader", icon: "fa-crown", equipped: true, desc: "Lobby leader in Premier.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Defender", icon: "fa-shield", equipped: true, desc: "Held critical positions at Bomb Site B.", shape: "shape-diamond", color: "green-emb" }
      ],
      detailsStats: [
        { key: "Premier Matches", val: "290" },
        { key: "Premier Hours", val: "350h" },
        { key: "Average KDA", val: "1.34" },
        { key: "Headshots Landed", val: "67.8%" },
        { key: "Total MVPs", val: "184" },
        { key: "Clutches Won", val: "42" }
      ],
      radarPoints: "100,28 160,78 138,154 62,152 28,78"
    },
    gta5: {
      name: "Grand Theft Auto V",
      rankTitle: "Organized Crime Boss",
      rankScore: "Score: $120.4M",
      hours: "250h",
      battles: "150 Heists",

      opLevel: "120",
      titleName: "Heist Mastermind",
      titleDesc: "Completed all heists on hard difficulty with the same team without anyone dying.",
      avatarUrl: "img/Gta 5 avatar.jpg",
      equippedEmblems: [
        { name: "Driver", icon: "fa-car", shape: "shape-circle", color: "gold-emb" },
        { name: "Gunslinger", icon: "fa-gun", shape: "shape-shield", color: "red-emb" },
        { name: "Planner", icon: "fa-mask", shape: "shape-shield", color: "cyan-emb" },
        { name: "Tycoon", icon: "fa-money-bill-wave", shape: "shape-diamond", color: "green-emb" }
      ],
      allEmblems: [
        { name: "Driver", icon: "fa-car", equipped: true, desc: "Won 50 street races.", shape: "shape-circle", color: "gold-emb" },
        { name: "Gunslinger", icon: "fa-gun", equipped: true, desc: "Eliminated 200 enemies with headshots.", shape: "shape-shield", color: "red-emb" },
        { name: "Planner", icon: "fa-mask", equipped: true, desc: "Planned and executed heist without triggering alarms.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Tycoon", icon: "fa-money-bill-wave", equipped: true, desc: "Accumulated over $100M in bank.", shape: "shape-diamond", color: "green-emb" }
      ],
      detailsStats: [
        { key: "Heists Completed", val: "150" },
        { key: "Hours Played", val: "250h" },
        { key: "Overall Online K/D", val: "1.45" },
        { key: "Properties Owned", val: "12" },
        { key: "Cars in Garage", val: "45" },
        { key: "Max Wanted Level", val: "5 Stars" }
      ],
      radarPoints: "100,32 165,75 138,150 62,148 26,75"
    }
  };

  // Forçar todas as conquistas a estarem adquiridas
  Object.keys(gameData).forEach(key => {
    if (gameData[key].allEmblems) {
      gameData[key].allEmblems.forEach(emb => {
        emb.equipped = true;
      });
    }
  });

  // Calculate dynamic radar coordinates based on stats
  const calculateRadarPoints = (data) => {
    let kd = 3.3;
    let extRate = 39.8;
    let rescues = 832;
    let lethality = 45.6;
    let wealthVal = 4.8e9;

    const parseFloatOnly = (str) => {
      if (!str) return 0;
      const match = String(str).match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    };

    const kdStr = String(data.kdRatio || data.avgKDRatio || "3.3");
    if (kdStr.includes("|")) {
      const parts = kdStr.split("|");
      kd = parseFloatOnly(parts[1]) || 3.3;
    } else {
      kd = parseFloatOnly(kdStr) || 3.3;
    }

    extRate = parseFloatOnly(data.extractionRate || data.extractRate || "39.8");
    rescues = parseFloatOnly(data.rescues || data.teammateRescues || "832");
    lethality = parseFloatOnly(data.lethality || data.lethalityRate || "45.6");

    const wealthStr = String(data.totalExtracted || data.assets || "4.8b").toLowerCase();
    let numericWealth = parseFloatOnly(wealthStr);
    if (wealthStr.includes("b")) {
      numericWealth *= 1e9;
    } else if (wealthStr.includes("m")) {
      numericWealth *= 1e6;
    }
    wealthVal = numericWealth;

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const scale_combat = clamp(0.2 + (kd / 5.0) * 0.8, 0.2, 1.0);
    const scale_survival = clamp(0.2 + (extRate / 70.0) * 0.8, 0.2, 1.0);
    const scale_coop1 = clamp(0.2 + (rescues / 1500.0) * 0.8, 0.2, 1.0);
    const scale_coop2 = clamp(0.2 + (lethality / 80.0) * 0.8, 0.2, 1.0);
    const scale_wealth = clamp(0.2 + (wealthVal / 8.0e9) * 0.8, 0.2, 1.0);

    const p1_x = 100;
    const p1_y = Math.round(100 - 80 * scale_combat);

    const p2_x = Math.round(100 + 76 * scale_survival);
    const p2_y = Math.round(100 - 25 * scale_survival);

    const p3_x = Math.round(100 + 47 * scale_coop1);
    const p3_y = Math.round(100 + 65 * scale_coop1);

    const p4_x = Math.round(100 - 47 * scale_coop2);
    const p4_y = Math.round(100 + 65 * scale_coop2);

    const p5_x = Math.round(100 - 76 * scale_wealth);
    const p5_y = Math.round(100 - 25 * scale_wealth);

    return `${p1_x},${p1_y} ${p2_x},${p2_y} ${p3_x},${p3_y} ${p4_x},${p4_y} ${p5_x},${p5_y}`;
  };

  // Load saved stats and account link status from localStorage
  const loadLocalStorageData = () => {
    // 1. Load custom CallSign and Avatar if set
    const savedName = localStorage.getItem('df_custom_callsign');
    if (savedName) {
      const nameEl = document.querySelector('.hud-main-name');
      if (nameEl) nameEl.textContent = savedName;
    }
    const savedAvatar = localStorage.getItem('df_custom_avatar');
    if (savedAvatar) {
      const avatarEl = document.querySelector('.hud-avatar-img');
      if (avatarEl) avatarEl.src = savedAvatar;
    }

    // 2. Load and merge custom titles into gameData
    const savedTitles = localStorage.getItem('df_custom_titles');
    if (savedTitles) {
      try {
        const parsedTitles = JSON.parse(savedTitles);
        Object.keys(parsedTitles).forEach(gameId => {
          if (gameData[gameId]) {
            if (!gameData[gameId].titles) gameData[gameId].titles = [];
            parsedTitles[gameId].forEach(customTitle => {
              if (!gameData[gameId].titles.some(t => t.name === customTitle.name)) {
                gameData[gameId].titles.push(customTitle);
              }
            });
          }
        });
      } catch (e) { console.error(e); }
    }

    // 3. Load and merge custom emblems into gameData
    const savedEmblems = localStorage.getItem('df_custom_emblems');
    if (savedEmblems) {
      try {
        const parsedEmblems = JSON.parse(savedEmblems);
        Object.keys(parsedEmblems).forEach(gameId => {
          if (gameData[gameId]) {
            if (!gameData[gameId].allEmblems) gameData[gameId].allEmblems = [];
            parsedEmblems[gameId].forEach(customEmb => {
              if (!gameData[gameId].allEmblems.some(e => e.name === customEmb.name)) {
                gameData[gameId].allEmblems.push(customEmb);

                // Force marked as equipped if it was equipped
                if (customEmb.equipped) {
                  if (!gameData[gameId].equippedEmblems) gameData[gameId].equippedEmblems = [];
                  if (!gameData[gameId].equippedEmblems.some(e => e.name === customEmb.name)) {
                    gameData[gameId].equippedEmblems.push(customEmb);
                  }
                }
              }
            });
          }
        });
      } catch (e) { console.error(e); }
    }

    // 4. Load basic stats overrides (Delta Force legacy support)
    const savedStats = localStorage.getItem('df_custom_stats');
    if (savedStats && gameData.deltaforce) {
      try {
        const parsed = JSON.parse(savedStats);
        Object.assign(gameData.deltaforce, parsed);
        gameData.deltaforce.detailsStats = [
          { key: "Total Battles", val: gameData.deltaforce.battles || "11430" },
          { key: "Playtime", val: gameData.deltaforce.hours || "4700h" },
          { key: "Avg. Profit/Loss", val: gameData.deltaforce.avgProfit || "1.4M" },
          { key: "Total Extracted Value", val: gameData.deltaforce.totalExtracted || "4.8b" },
          { key: "Mission Rewards", val: gameData.deltaforce.missionRewards || "1.8M" },
          { key: "MandelBricks Decoded", val: gameData.deltaforce.mandelbricks || "122" },
          { key: "Avg. K/D Ratio", val: gameData.deltaforce.kdRatio || "13 | 3.3 | 1.9" },
          { key: "Operator Eliminations", val: gameData.deltaforce.kills || "37,719" },
          { key: "Overall Accuracy", val: gameData.deltaforce.accuracy || "35.5%" },
          { key: "Lethality Rate", val: gameData.deltaforce.lethality || "45.6%" },
          { key: "Extraction Rate", val: gameData.deltaforce.extractionRate || "39.8%" },
          { key: "Friendly Extraction Value", val: gameData.deltaforce.friendlyExtract || "18.1M" },
          { key: "Teammate Rescues", val: gameData.deltaforce.rescues || "832" },
          { key: "Revived Teammates", val: gameData.deltaforce.revives || "832" }
        ];
      } catch (e) { console.error(e); }
    }

    // 5. Load generalized game-by-game stats overrides
    const savedGameStats = localStorage.getItem('df_game_stats');
    if (savedGameStats) {
      try {
        const parsedStats = JSON.parse(savedGameStats);
        Object.keys(parsedStats).forEach(gameId => {
          if (gameData[gameId]) {
            const gameOverride = parsedStats[gameId];

            if (gameOverride.hours) gameData[gameId].hours = gameOverride.hours;
            if (gameOverride.battles) gameData[gameId].battles = gameOverride.battles;
            if (gameOverride.rankTitle) gameData[gameId].rankTitle = gameOverride.rankTitle;
            if (gameOverride.rankScore) gameData[gameId].rankScore = gameOverride.rankScore;

            if (gameOverride.detailsStats) {
              gameOverride.detailsStats.forEach(overrideStat => {
                const found = gameData[gameId].detailsStats.find(s => s.key.toLowerCase() === overrideStat.key.toLowerCase());
                if (found) {
                  found.val = overrideStat.val;
                } else {
                  gameData[gameId].detailsStats.push(overrideStat);
                }
              });
            }
          }
        });
      } catch (e) {
        console.error("Failed to parse saved game stats:", e);
      }
    }
  };

  loadLocalStorageData();

  // Elementos do launcher de abas
  const tabsHeader = document.getElementById('tabsHeader');
  const tabGamesBtn = document.getElementById('tabGamesBtn');
  const tabAmigoBtn = document.getElementById('tabAmigoBtn');
  const backToGamesBtn = document.getElementById('backToGamesBtn');
  const gameTabs = document.querySelectorAll('.game-tab');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Lógica de seleção do jogo
  const launcherCards = document.querySelectorAll('.launcher-game-card');

  // Control variable for currently active game
  let currentActiveGameId = 'deltaforce';

  const selectGame = (gameId, preserveTab = false) => {
    currentActiveGameId = gameId;
    const data = gameData[gameId];
    if (!data) return;

    // 1. Atualizar Abas do Header
    if (tabsHeader) tabsHeader.classList.add('game-active');
    if (tabGamesBtn) tabGamesBtn.classList.add('hidden');
    if (tabAmigoBtn) tabAmigoBtn.classList.add('hidden');
    if (backToGamesBtn) backToGamesBtn.classList.remove('hidden');
    gameTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === 'conquistas' && gameId !== 'deltaforce' && gameId !== 'rust') {
        tab.classList.add('hidden');
      } else {
        tab.classList.remove('hidden');
      }
    });

    // 2. Carregar informações reais na aba PERFIL
    document.getElementById('profileHeader').textContent = `// OPERATOR: ${data.name.toUpperCase()}`;
    document.getElementById('dfRankTitle').textContent = data.rankTitle;
    document.getElementById('dfRankScore').textContent = data.rankScore;
    document.getElementById('dfHours').textContent = data.hours;
    document.getElementById('dfBattles').textContent = data.battles;
    const assetsEl = document.getElementById('dfAssets');
    const extractRateEl = document.getElementById('dfExtractRate');

    if (assetsEl) {
      const parent = assetsEl.closest('.df-sm-item');
      if (parent) {
        if (data.assets) {
          assetsEl.textContent = data.assets;
          parent.style.display = 'flex';
        } else {
          parent.style.display = 'none';
        }
      }
    }

    if (extractRateEl) {
      const parent = extractRateEl.closest('.df-sm-item');
      if (parent) {
        if (data.extractionRate) {
          extractRateEl.textContent = data.extractionRate;
          parent.style.display = 'flex';
        } else {
          parent.style.display = 'none';
        }
      }
    }
    const opLevelEl = document.getElementById('dfOpLevel');
    if (opLevelEl) {
      opLevelEl.textContent = `Lv ${data.opLevel}`;
    }
    const profileTitleEl = document.getElementById('dfProfileTitle');
    if (profileTitleEl) {
      profileTitleEl.textContent = data.titleName;
    }

    // Atualizar avatar na aba Perfil
    const charAvatar = document.querySelector('#tab-perfil .char-avatar-render');
    if (charAvatar) {
      charAvatar.src = data.avatarUrl;
    }

    // Grid de emblemas equipados com design de patch militar real
    const equippedEmblemsContainer = document.querySelector('.df-equipped-emblems');
    if (equippedEmblemsContainer) {
      if (gameId === 'deltaforce' || gameId === 'rust') {
        equippedEmblemsContainer.style.display = 'block';
      } else {
        equippedEmblemsContainer.style.display = 'none';
      }
    }

    const equippedGrid = document.getElementById('dfEquippedGrid');
    equippedGrid.innerHTML = '';
    if ((gameId === 'deltaforce' || gameId === 'rust') && data.equippedEmblems) {
      data.equippedEmblems.forEach(emb => {
        const slot = document.createElement('div');
        slot.className = `df-ee-slot`;

        const matchingEmb = data.allEmblems ? data.allEmblems.find(ae => ae.name === emb.name) : null;
        const desc = matchingEmb ? matchingEmb.desc : "Equipped military emblem.";
        setupTooltip(slot, emb.name, desc, "EQUIPPED");

        if (emb.file) {
          slot.innerHTML = `
            <div class="emblem-patch has-image">
              <img src="img/emblemas/${emb.file}" alt="${emb.name}" class="emblem-img" loading="lazy">
            </div>
          `;
        } else if (emb.spriteIndex !== undefined && slicedEmblems[emb.spriteIndex]) {
          slot.innerHTML = `
            <div class="emblem-patch has-image">
              <img src="${slicedEmblems[emb.spriteIndex]}" alt="${emb.name}" class="emblem-img" loading="lazy">
            </div>
          `;
        } else {
          slot.innerHTML = `
            <div class="emblem-patch ${emb.shape} ${emb.color}">
              <i class="fas ${emb.icon}"></i>
            </div>
          `;
        }
        equippedGrid.appendChild(slot);
      });
    }

    // 3. Carregar informações na aba DETALHES
    document.getElementById('detailsHeader').textContent = `// PERFORMANCE IN ${data.name.toUpperCase()}`;
    const detailsGrid = document.getElementById('dfDetailsGrid');
    detailsGrid.innerHTML = '';
    data.detailsStats.forEach(stat => {
      const row = document.createElement('div');
      row.className = 'pd-row';
      row.innerHTML = `
        <span class="pd-key">${stat.key.toUpperCase()}</span>
        <span class="pd-val">${stat.val}</span>
      `;
      detailsGrid.appendChild(row);
    });

    // Atualizar gráfico de radar SVG
    const radarPoly = document.getElementById('dfRadarPoly');
    if (radarPoly) {
      if (gameId === 'deltaforce') {
        const dynamicPoints = calculateRadarPoints(data);
        radarPoly.setAttribute('points', dynamicPoints);
      } else {
        radarPoly.setAttribute('points', data.radarPoints);
      }
    }

    // 4. Carregar informações na aba CONQUISTAS
    const titleDisplay = document.getElementById('dfTitleDisplay');
    const allTitlesSection = document.getElementById('dfAllTitlesSection');
    const titlesGrid = document.getElementById('dfTitlesGrid');

    if (data.titles && data.titles.length > 0) {
      if (allTitlesSection) allTitlesSection.classList.remove('hidden');

      // Encontrar título ativo
      const activeTitle = data.titles.find(t => t.id === data.activeTitleId) || data.titles[0];

      // Renderizar o banner ativo
      if (titleDisplay) {
        titleDisplay.innerHTML = `
          <div class="df-title-display-container">
            <img src="img/titulos/${activeTitle.file}" alt="${activeTitle.name}" class="df-title-banner-img" loading="lazy">
            <div class="df-title-display-info">
              <div class="df-td-name">${activeTitle.name}</div>
              <div class="df-td-desc">${activeTitle.desc}</div>
              <div style="margin-top: 4px;">
                <span class="tooltip-status equipped">EQUIPPED</span>
              </div>
            </div>
          </div>
        `;
      }

      // Renderizar o grid de seleção de títulos
      if (titlesGrid) {
        titlesGrid.innerHTML = '';
        data.titles.forEach(title => {
          const titleCard = document.createElement('div');
          titleCard.className = `df-title-card-selector ${title.id === data.activeTitleId ? 'active' : ''}`;
          titleCard.innerHTML = `
            <img src="img/titulos/${title.file}" alt="${title.name}" loading="lazy">
          `;

          setupTooltip(titleCard, title.name, title.desc, title.id === data.activeTitleId ? "EQUIPPED" : "AVAILABLE");

          titleCard.addEventListener('click', () => {
            // Atualizar ID ativo
            data.activeTitleId = title.id;
            data.titleName = title.name;

            // Atualizar o nome do título no perfil
            const profileTitleEl = document.getElementById('dfProfileTitle');
            if (profileTitleEl) profileTitleEl.textContent = title.name;

            // Esconder tooltip ativo antes de recarregar
            if (tooltipEl) tooltipEl.classList.remove('active');

            // Re-renderizar a aba inteira do jogo de forma limpa e consistente
            selectGame(gameId, true);
          });

          titlesGrid.appendChild(titleCard);
        });
      }
    } else {
      // Fallback para outros jogos que usam texto comum
      if (allTitlesSection) allTitlesSection.classList.add('hidden');
      if (titleDisplay) {
        titleDisplay.innerHTML = `
          <div class="df-title-display-container">
            <div class="df-title-fallback-icon">
              <i class="fas fa-ribbon"></i>
            </div>
            <div class="df-title-display-info">
              <div class="df-td-name">${data.titleName}</div>
              <div class="df-td-desc">${data.titleDesc || 'Active military title.'}</div>
              <div style="margin-top: 4px;">
                <span class="tooltip-status equipped">EQUIPPED</span>
              </div>
            </div>
          </div>
        `;
      }
    }

    // Grid de 18 emblemas com visual de patch militar real
    const allEmblemsGrid = document.getElementById('dfAllEmblemsGrid');
    allEmblemsGrid.innerHTML = '';

    const emblemsToLoad = data.allEmblems || [];
    emblemsToLoad.forEach(emb => {
      const card = document.createElement('div');
      card.className = `emblem-card-grid ${emb.equipped ? 'equipped' : ''}`;

      setupTooltip(card, emb.name, emb.desc, emb.equipped ? "UNLOCKED" : "LOCKED");

      if (emb.file) {
        card.innerHTML = `
          <div class="emblem-patch has-image">
            <img src="img/emblemas/${emb.file}" alt="${emb.name}" class="emblem-img" loading="lazy">
          </div>
        `;
      } else if (emb.spriteIndex !== undefined && slicedEmblems[emb.spriteIndex]) {
        card.innerHTML = `
          <div class="emblem-patch has-image">
            <img src="${slicedEmblems[emb.spriteIndex]}" alt="${emb.name}" class="emblem-img" loading="lazy">
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="emblem-patch ${emb.shape} ${emb.color}">
            <i class="fas ${emb.icon}"></i>
          </div>
        `;
      }
      allEmblemsGrid.appendChild(card);
    });

    // 6. Ativar aba de Perfil por padrão
    if (!preserveTab) {
      activateTab('perfil');
    }
  };

  // Retornar ao launcher principal
  const resetToLauncher = () => {
    if (tabsHeader) tabsHeader.classList.remove('game-active');
    if (tabGamesBtn) tabGamesBtn.classList.remove('hidden');
    if (tabAmigoBtn) tabAmigoBtn.classList.remove('hidden');
    if (backToGamesBtn) backToGamesBtn.classList.add('hidden');
    gameTabs.forEach(tab => tab.classList.add('hidden'));

    // Reverter avatar na aba Perfil (local)
    const charAvatar = document.querySelector('#tab-perfil .char-avatar-render');
    if (charAvatar) {
      charAvatar.src = 'img/operator_render.png';
    }

    activateTab('jogos');
  };

  // Função para mudar abas ativas
  const activateTab = (tabName) => {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabName}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  };

  // Ouvintes de clique nos cards de jogos do launcher
  launcherCards.forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game');
      selectGame(gameId);
    });
  });

  // Ouvintes de clique para alternar abas normais
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      if (targetTab) {
        activateTab(targetTab);
      }
    });
  });

  // Ouvinte de clique para voltar aos jogos
  if (backToGamesBtn) {
    backToGamesBtn.addEventListener('click', resetToLauncher);
  }

  // Seletores DOM do Modal e do Toast
  const syncModal = document.getElementById('sync-modal');
  const btnOpenSync = document.getElementById('btnOpenSync');
  const closeSyncModal = document.getElementById('closeSyncModal');
  const syncModalOverlay = document.getElementById('syncModalOverlay');

  const dfSearchNickname = document.getElementById('dfSearchNickname');
  const btnSearchConnect = document.getElementById('btnSearchConnect');
  const searchFeedback = document.getElementById('searchFeedback');
  const syncStatusDot = document.getElementById('syncStatusDot');
  const syncStatusText = document.getElementById('syncStatusText');
  const linkedAccountDetails = document.getElementById('linkedAccountDetails');
  const linkedName = document.getElementById('linkedName');
  const linkedUID = document.getElementById('linkedUID');

  const quickSyncIndicator = document.getElementById('quickSyncIndicator');
  const quickSyncName = document.getElementById('quickSyncName');

  const chkAutoSync = document.getElementById('chkAutoSync');
  const btnManualSyncAction = document.getElementById('btnManualSyncAction');

  // Elementos Mod Control (Gerais)
  const btnOpenModControl = document.getElementById('btnOpenModControl');
  const dfSyncActionRow = document.getElementById('dfSyncActionRow');
  const btnCancelModPanel = document.getElementById('btnCancelModPanel');
  const btnSaveManualStats = document.getElementById('btnSaveManualStats');

  // Seletores do Editor Identidade Global
  const editGlobalName = document.getElementById('editGlobalName');
  const editGlobalAvatar = document.getElementById('editGlobalAvatar');

  // Seletores do Editor Estatísticas do Jogo Ativo
  const modActiveGameHeader = document.getElementById('modActiveGameHeader');
  const editGameRankTitle = document.getElementById('editGameRankTitle');
  const editGameRankScore = document.getElementById('editGameRankScore');
  const editGameBattles = document.getElementById('editGameBattles');
  const editGameHours = document.getElementById('editGameHours');
  const dynamicStatsFieldsContainer = document.getElementById('dynamicStatsFieldsContainer');

  // Seletores do Criador de Novos Itens
  const newTitleName = document.getElementById('newTitleName');
  const newTitleFile = document.getElementById('newTitleFile');
  const newTitleDesc = document.getElementById('newTitleDesc');
  const btnAddTitle = document.getElementById('btnAddTitle');

  const newEmblemName = document.getElementById('newEmblemName');
  const newEmblemFile = document.getElementById('newEmblemFile');
  const newEmblemIcon = document.getElementById('newEmblemIcon');
  const newEmblemShape = document.getElementById('newEmblemShape');
  const newEmblemColor = document.getElementById('newEmblemColor');
  const newEmblemUnlocked = document.getElementById('newEmblemUnlocked');
  const newEmblemDesc = document.getElementById('newEmblemDesc');
  const btnAddEmblem = document.getElementById('btnAddEmblem');

  // Elementos do Lock de Segurança do Modal
  const syncLoginView = document.getElementById('sync-login-view');
  const syncAdminView = document.getElementById('sync-admin-view');
  const adminPassKey = document.getElementById('adminPassKey');
  const btnAdminUnlock = document.getElementById('btnAdminUnlock');
  const btnAdminLogout = document.getElementById('btnAdminLogout');
  const loginFeedback = document.getElementById('loginFeedback');

  // Elementos da seleção no Overlay de Intro
  const btnModeUser = document.getElementById('btnModeUser');
  const btnModeMod = document.getElementById('btnModeMod');
  const introPassInputWrapper = document.getElementById('introPassInputWrapper');
  const introPassKey = document.getElementById('introPassKey');
  const btnIntroUnlock = document.getElementById('btnIntroUnlock');

  const toastContainer = document.getElementById('hud-notification-container');

  // Password Hash para verificação de login (@Joaquim2006 -> Base64 QEpvYXF1aW0yMDA2)
  const masterKeyHash = "QEpvYXF1aW0yMDA2";

  // Utility to show beautiful tactical HUD toasts
  const showHUDToast = (title, message, duration = 5000) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'hud-toast';
    toast.innerHTML = `
      <div class="hud-toast-header">
        <span>// ${title.toUpperCase()}</span>
        <button class="hud-toast-close">&times;</button>
      </div>
      <div class="hud-toast-body">${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Animate slide-in
    setTimeout(() => toast.classList.add('show'), 50);

    // Close button event
    toast.querySelector('.hud-toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    });

    // Auto remove
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }
    }, duration);
  };

  // Helper to add terminal-like feedback inside the modal connection console
  const addConsoleLog = (text, type = 'normal') => {
    if (!searchFeedback) return;
    const line = document.createElement('div');
    line.className = `log-line ${type === 'dim' ? 'text-dim' : type === 'error' ? 'text-error' : ''}`;
    line.textContent = `> ${text}`;
    searchFeedback.appendChild(line);
    searchFeedback.scrollTop = searchFeedback.scrollHeight;
  };

  const addLoginLog = (text, type = 'normal') => {
    if (!loginFeedback) return;
    const line = document.createElement('div');
    line.className = `log-line ${type === 'dim' ? 'text-dim' : type === 'error' ? 'text-error' : ''}`;
    line.textContent = `> ${text}`;
    loginFeedback.appendChild(line);
    loginFeedback.scrollTop = loginFeedback.scrollHeight;
  };

  // ══════════════════════════
  // SELETOR DE MODO NA INTRODUÇÃO
  // ══════════════════════════
  if (btnModeUser) {
    btnModeUser.addEventListener('click', () => {
      btnModeUser.classList.add('active');
      if (btnModeMod) btnModeMod.classList.remove('active');
      if (introPassInputWrapper) introPassInputWrapper.style.display = 'none';
      isModSelectionInProgress = false;
      localStorage.removeItem('df_admin_session');
      finishBootSequence();
    });
  }

  if (btnModeMod) {
    btnModeMod.addEventListener('click', () => {
      btnModeMod.classList.add('active');
      if (btnModeUser) btnModeUser.classList.remove('active');
      if (introPassInputWrapper) {
        introPassInputWrapper.style.display = 'flex';
        introPassKey.focus();
      }
      isModSelectionInProgress = true;
      // Pausa a contagem regressiva de carregamento automático
      if (bootInterval) clearInterval(bootInterval);
      if (introTerminal) {
        introTerminal.textContent = "AWAITING AUTHORIZATION PASSCODE...";
      }
    });
  }

  // Desbloqueio pelo input da tela de intro
  const handleIntroUnlockAction = () => {
    const entered = introPassKey.value.trim();
    if (!entered) return;

    if (introTerminal) introTerminal.textContent = "VERIFYING PASSCODE IN CONTROL NODE...";

    setTimeout(() => {
      if (btoa(entered) === masterKeyHash) {
        localStorage.setItem('df_admin_session', 'active');
        if (introTerminal) {
          introTerminal.textContent = "DECRYPTING ADMIN MODULES... MOD MODE ENABLED.";
        }
        setTimeout(() => {
          finishBootSequence();
          showHUDToast("admin authorization", "Mod privileges activated successfully.");
        }, 600);
      } else {
        if (introTerminal) {
          introTerminal.textContent = "ACCESS DENIED: RESUMING BOOT SEQUENCE AS GUEST...";
        }
        localStorage.removeItem('df_admin_session');
        setTimeout(() => {
          finishBootSequence();
          showHUDToast("security block", "Invalid password key. Booted in guest mode.");
        }, 1200);
      }
    }, 800);
  };

  if (btnIntroUnlock) {
    btnIntroUnlock.addEventListener('click', handleIntroUnlockAction);
  }
  if (introPassKey) {
    introPassKey.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleIntroUnlockAction();
    });
  }

  // Security View Session Manager
  const checkAdminSession = () => {
    const sessionActive = localStorage.getItem('df_admin_session') === 'active';
    if (sessionActive) {
      if (syncLoginView) syncLoginView.classList.add('hidden-details');
      if (syncAdminView) syncAdminView.classList.remove('hidden-details');
      if (btnAdminLogout) btnAdminLogout.style.display = 'block';
    } else {
      if (syncLoginView) syncLoginView.classList.remove('hidden-details');
      if (syncAdminView) syncAdminView.classList.add('hidden-details');
      if (btnAdminLogout) btnAdminLogout.style.display = 'none';
      if (adminPassKey) adminPassKey.value = '';
    }
    updateModUIVisibility();
  };

  // Password Unlock check inside Modal
  if (btnAdminUnlock) {
    btnAdminUnlock.addEventListener('click', () => {
      const entered = adminPassKey.value.trim();
      if (!entered) return;

      if (loginFeedback) loginFeedback.innerHTML = '';
      addLoginLog("AUTHORIZING CREDENTIALS...", "normal");

      setTimeout(() => {
        if (btoa(entered) === masterKeyHash) {
          localStorage.setItem('df_admin_session', 'active');
          addLoginLog("DECRYPTING DATABASE SHEET... SUCCESS", "normal");

          setTimeout(() => {
            showHUDToast("authorization granted", "Database decrypted. Mod dashboard unlocked.");
            checkAdminSession();
            loadActiveGameStatsIntoForm();
          }, 600);
        } else {
          addLoginLog("ACCESS DENIED: INVALID SECURITY KEY", "error");
          showHUDToast("security alert", "Access blocked. Unauthorized modification request.", 4000);
        }
      }, 700);
    });
  }

  // Logout / Lock console Action
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      localStorage.removeItem('df_admin_session');
      checkAdminSession();
      if (loginFeedback) {
        loginFeedback.innerHTML = '<div class="log-line text-dim">Gateway standing by. Awaiting key auth...</div>';
      }
      showHUDToast("system locked", "Administrative session terminated. Database encrypted.");
    });
  }

  // Controla visibilidade de botões MOD no layout principal
  const updateModUIVisibility = () => {
    const isMod = localStorage.getItem('df_admin_session') === 'active';
    if (isMod) {
      if (btnOpenModControl) btnOpenModControl.style.display = 'block';
      if (dfSyncActionRow) dfSyncActionRow.style.display = 'flex';
    } else {
      if (btnOpenModControl) btnOpenModControl.style.display = 'none';
      if (dfSyncActionRow) dfSyncActionRow.style.display = 'none';
    }
  };

  // Carrega as estatísticas do jogo ativo nos inputs do Modal
  const loadActiveGameStatsIntoForm = () => {
    const gameId = currentActiveGameId || 'deltaforce';
    const data = gameData[gameId];
    if (!data) return;

    // Header
    if (modActiveGameHeader) {
      modActiveGameHeader.textContent = `// ACTIVE GAME CONFIG: ${data.name.toUpperCase()}`;
    }

    // CallSign e Avatar global
    if (editGlobalName) {
      const nameEl = document.querySelector('.hud-main-name');
      editGlobalName.value = nameEl ? nameEl.textContent : "CLOUTCH";
    }
    if (editGlobalAvatar) {
      const avatarEl = document.querySelector('.hud-avatar-img');
      editGlobalAvatar.value = avatarEl ? avatarEl.getAttribute('src') : "img/Principal avatar.png";
    }

    // Dados base
    if (editGameRankTitle) editGameRankTitle.value = data.rankTitle || "";
    if (editGameRankScore) editGameRankScore.value = data.rankScore || "";
    if (editGameBattles) editGameBattles.value = data.battles || "";
    if (editGameHours) editGameHours.value = data.hours || "";

    // Dados de performance extras dinâmicos
    if (dynamicStatsFieldsContainer) {
      dynamicStatsFieldsContainer.innerHTML = '';
      if (data.detailsStats) {
        data.detailsStats.forEach((stat, index) => {
          const field = document.createElement('div');
          field.className = 'editor-field';
          field.innerHTML = `
            <label>${stat.key.toUpperCase()}</label>
            <input type="text" class="hud-input dynamic-stat-input" data-key="${stat.key}" value="${stat.val}">
          `;
          dynamicStatsFieldsContainer.appendChild(field);
        });
      }
    }
  };

  // Open Sync / Mod Modal
  if (btnOpenSync) {
    btnOpenSync.addEventListener('click', () => {
      if (syncModal) {
        syncModal.classList.add('active');
        checkAdminSession();
        if (localStorage.getItem('df_admin_session') === 'active') {
          loadActiveGameStatsIntoForm();
        }
      }
    });
  }

  if (btnOpenModControl) {
    btnOpenModControl.addEventListener('click', () => {
      if (syncModal) {
        syncModal.classList.add('active');
        checkAdminSession();
        if (localStorage.getItem('df_admin_session') === 'active') {
          loadActiveGameStatsIntoForm();
        }
      }
    });
  }

  // Close Sync Modal
  const hideSyncModal = () => {
    if (syncModal) syncModal.classList.remove('active');
  };

  if (closeSyncModal) closeSyncModal.addEventListener('click', hideSyncModal);
  if (syncModalOverlay) syncModalOverlay.addEventListener('click', hideSyncModal);
  if (btnCancelModPanel) btnCancelModPanel.addEventListener('click', hideSyncModal);

  // Sync / Link account simulation inside Mod Panel
  const updateConnectionUI = (linkedAccount) => {
    if (!linkedAccount) {
      syncStatusDot.className = 'ping-dot red';
      syncStatusText.textContent = 'DISCONNECTED';
      syncStatusText.className = 'status-text text-red';
      linkedAccountDetails.className = 'hidden-details';
      if (quickSyncIndicator) quickSyncIndicator.style.display = 'none';
      if (btnSearchConnect) btnSearchConnect.innerHTML = `CONNECT`;
    } else {
      syncStatusDot.className = 'ping-dot green';
      syncStatusText.textContent = 'CONNECTED';
      syncStatusText.className = 'status-text text-green';
      linkedName.textContent = linkedAccount.name;
      linkedUID.textContent = linkedAccount.uid;
      linkedAccountDetails.className = 'visible-details';

      if (quickSyncIndicator && quickSyncName) {
        quickSyncName.textContent = `${linkedAccount.name} (${linkedAccount.uid})`;
        quickSyncIndicator.style.display = 'flex';
      }
      if (btnSearchConnect) btnSearchConnect.innerHTML = `DISCONNECT`;
    }
  };

  // Check initial connection state from LocalStorage
  let currentLinkedAccount = null;
  const savedAccount = localStorage.getItem('df_linked_account');
  if (savedAccount) {
    try {
      currentLinkedAccount = JSON.parse(savedAccount);
      updateConnectionUI(currentLinkedAccount);
    } catch (e) {
      console.error(e);
    }
  }

  // Connect / Disconnect Action
  if (btnSearchConnect) {
    btnSearchConnect.addEventListener('click', () => {
      if (currentLinkedAccount) {
        currentLinkedAccount = null;
        localStorage.removeItem('df_linked_account');
        updateConnectionUI(null);
        searchFeedback.innerHTML = '';
        addConsoleLog("Connection terminated by user request.", "dim");
        showHUDToast("database status", "Disconnected from Delta Force Network.");
      } else {
        const query = dfSearchNickname.value.trim();
        if (!query) {
          addConsoleLog("ERROR: Enter nickname/UID.", "error");
          return;
        }

        searchFeedback.innerHTML = '';
        addConsoleLog(`Initiating Handshake with DELTA_FORCE_NET...`, "normal");
        btnSearchConnect.disabled = true;
        btnSearchConnect.style.opacity = '0.5';

        setTimeout(() => {
          addConsoleLog("DNS resolved. Target node: hawkops-eu-central-3.garena.net", "dim");
        }, 300);

        setTimeout(() => {
          addConsoleLog(`Searching database for: "${query}"...`, "normal");
        }, 800);

        setTimeout(() => {
          const isNumeric = /^\d+$/.test(query);
          const uid = isNumeric ? query : Math.floor(100000000 + Math.random() * 900000000);
          const name = isNumeric ? `Operator_${query.substring(0, 4)}` : query.toUpperCase();

          currentLinkedAccount = { name, uid };
          localStorage.setItem('df_linked_account', JSON.stringify(currentLinkedAccount));

          updateConnectionUI(currentLinkedAccount);
          addConsoleLog("ACCOUNT SYNC SUCCESSFUL!", "normal");
          addConsoleLog(`CallSign [${name}] UID [${uid}]`, "dim");

          btnSearchConnect.disabled = false;
          btnSearchConnect.style.opacity = '1';

          showHUDToast("network link", `Connected to Garena profile: ${name}`);
        }, 1400);
      }
    });
  }

  // ADICIONAR NOVO TÍTULO MILITAR (Mod Mode)
  if (btnAddTitle) {
    btnAddTitle.addEventListener('click', () => {
      const name = newTitleName.value.trim();
      const file = newTitleFile.value.trim();
      const desc = newTitleDesc.value.trim();
      const gameId = currentActiveGameId || 'deltaforce';

      if (!name || !file) {
        showHUDToast("editor error", "Please enter title name and banner file.");
        return;
      }

      const newTitleObj = {
        name: name,
        id: `custom_${Date.now()}`,
        file: file,
        desc: desc || "Custom achievements title."
      };

      // Carregar títulos existentes na localStorage ou criar novo mapa
      let customTitlesMap = {};
      const saved = localStorage.getItem('df_custom_titles');
      if (saved) {
        try { customTitlesMap = JSON.parse(saved); } catch (e) { console.error(e); }
      }

      if (!customTitlesMap[gameId]) customTitlesMap[gameId] = [];
      customTitlesMap[gameId].push(newTitleObj);

      localStorage.setItem('df_custom_titles', JSON.stringify(customTitlesMap));

      // Limpar formulário
      newTitleName.value = '';
      newTitleFile.value = '';
      newTitleDesc.value = '';

      // Recarregar memória e renderizar
      loadLocalStorageData();

      // Auto-equipar o novo título adicionado
      if (gameData[gameId]) {
        gameData[gameId].activeTitleId = newTitleObj.id;
        gameData[gameId].titleName = newTitleObj.name;
        gameData[gameId].titleDesc = newTitleObj.desc;
      }

      selectGame(gameId, true);

      showHUDToast("military record", `Custom title "${name}" added to ${gameData[gameId].name}.`);
    });
  }

  // ADICIONAR NOVO EMBLEMA COLETÁVEL (Mod Mode)
  if (btnAddEmblem) {
    btnAddEmblem.addEventListener('click', () => {
      const name = newEmblemName.value.trim();
      const file = newEmblemFile.value.trim();
      const icon = newEmblemIcon.value.trim() || "fa-award";
      const shape = newEmblemShape.value;
      const color = newEmblemColor.value;
      const unlocked = newEmblemUnlocked.value === 'true';
      const desc = newEmblemDesc.value.trim();
      const gameId = currentActiveGameId || 'deltaforce';

      if (!name) {
        showHUDToast("editor error", "Please enter emblem name.");
        return;
      }

      const newEmbObj = {
        name: name,
        equipped: unlocked,
        desc: desc || "Custom collectible emblem.",
        shape: shape,
        color: color
      };

      if (file) {
        newEmbObj.file = file;
      } else {
        newEmbObj.icon = icon;
      }

      // Carregar emblemas da localStorage
      let customEmblemsMap = {};
      const saved = localStorage.getItem('df_custom_emblems');
      if (saved) {
        try { customEmblemsMap = JSON.parse(saved); } catch (e) { console.error(e); }
      }

      if (!customEmblemsMap[gameId]) customEmblemsMap[gameId] = [];
      customEmblemsMap[gameId].push(newEmbObj);

      localStorage.setItem('df_custom_emblems', JSON.stringify(customEmblemsMap));

      // Limpar formulário
      newEmblemName.value = '';
      newEmblemFile.value = '';
      newEmblemIcon.value = 'fa-award';
      newEmblemDesc.value = '';

      // Recarregar e atualizar UI
      loadLocalStorageData();
      selectGame(gameId, true);

      showHUDToast("military record", `Custom emblem "${name}" added to ${gameData[gameId].name}.`);
    });
  }

  // SALVAR TODAS AS ALTERAÇÕES (Mod Panel Submit)
  if (btnSaveManualStats) {
    btnSaveManualStats.addEventListener('click', () => {
      const gameId = currentActiveGameId || 'deltaforce';
      const data = gameData[gameId];
      if (!data) return;

      // 1. Atualizar Identidade Global
      const nameVal = editGlobalName.value.trim();
      const avatarVal = editGlobalAvatar.value.trim();

      if (nameVal) localStorage.setItem('df_custom_callsign', nameVal);
      if (avatarVal) localStorage.setItem('df_custom_avatar', avatarVal);

      // 2. Atualizar Estatísticas do Jogo Selecionado
      const rankTitleVal = editGameRankTitle.value.trim();
      const rankScoreVal = editGameRankScore.value.trim();
      const battlesVal = editGameBattles.value.trim();
      const hoursVal = editGameHours.value.trim();

      const gameOverrideObj = {
        hours: hoursVal,
        battles: battlesVal,
        rankTitle: rankTitleVal,
        rankScore: rankScoreVal,
        detailsStats: []
      };

      // Ler os inputs dinamicamente gerados de performance extra
      const dynamicFields = dynamicStatsFieldsContainer.querySelectorAll('.dynamic-stat-input');
      dynamicFields.forEach(input => {
        const key = input.getAttribute('data-key');
        const val = input.value.trim();
        gameOverrideObj.detailsStats.push({ key, val });
      });

      // Carregar mapa de overrides dos jogos da localStorage
      let gameStatsMap = {};
      const savedStats = localStorage.getItem('df_game_stats');
      if (savedStats) {
        try { gameStatsMap = JSON.parse(savedStats); } catch (e) { console.error(e); }
      }

      gameStatsMap[gameId] = gameOverrideObj;
      localStorage.setItem('df_game_stats', JSON.stringify(gameStatsMap));

      // 3. Suporte legacia para Delta Force (df_custom_stats)
      if (gameId === 'deltaforce') {
        const kdInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Avg. K/D Ratio");
        const killsInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Operator Eliminations");
        const profitInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Avg. Profit/Loss");
        const extractedInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Total Extracted Value");
        const missionInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Mission Rewards");
        const accuracyInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Overall Accuracy");
        const lethalityInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Lethality Rate");
        const extractionInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Extraction Rate");
        const mandelbricksInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "MandelBricks Decoded");
        const friendlyExtractInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Friendly Extraction Value");
        const rescuesInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Teammate Rescues");
        const revivesInput = Array.from(dynamicFields).find(input => input.getAttribute('data-key') === "Revived Teammates");

        const legacyObj = {
          hours: hoursVal,
          battles: battlesVal,
          rankTitle: rankTitleVal,
          rankScore: rankScoreVal,
          avgProfit: profitInput ? profitInput.value : "1.4M",
          totalExtracted: extractedInput ? extractedInput.value : "4.8b",
          missionRewards: missionInput ? missionInput.value : "1.8M",
          kdRatio: kdInput ? kdInput.value : "13 | 3.3 | 1.9",
          kills: killsInput ? killsInput.value : "37,719",
          accuracy: accuracyInput ? accuracyInput.value : "35.5%",
          lethality: lethalityInput ? lethalityInput.value : "45.6%",
          extractionRate: extractionInput ? extractionInput.value : "39.8%",
          mandelbricks: mandelbricksInput ? mandelbricksInput.value : "122",
          friendlyExtract: friendlyExtractInput ? friendlyExtractInput.value : "18.1M",
          rescues: rescuesInput ? rescuesInput.value : "832",
          revives: revivesInput ? revivesInput.value : "832"
        };
        localStorage.setItem('df_custom_stats', JSON.stringify(legacyObj));
      }

      // Sincronizar UI geral
      loadLocalStorageData();
      selectGame(gameId, true);

      showHUDToast("mod database", "All customized records, credentials and identities have been secured.");
      hideSyncModal();
    });
  }

  // Manual database sync action (legacia de suporte Delta Force)
  if (btnManualSyncAction) {
    btnManualSyncAction.addEventListener('click', () => {
      btnManualSyncAction.disabled = true;
      btnManualSyncAction.classList.add('loading');
      btnManualSyncAction.innerHTML = `<i class="fas fa-spinner"></i> SYNCING...`;

      showHUDToast("Database sync", "Querying Garena servers for online match delta...");

      setTimeout(() => {
        const df = gameData.deltaforce;
        if (df) {
          const hoursNum = parseFloat(df.hours) + 0.8;
          const battlesNum = parseInt(df.battles) + 2;

          const getVal = (key) => parseFloat(df.detailsStats.find(s => s.key === key).val.replace(/[^\d.]/g, ''));
          const currentKills = getVal("Operator Eliminations") + 4;
          const currentExtracted = parseFloat(df.detailsStats.find(s => s.key === "Total Extracted Value").val) + 0.1;

          const updatedStatsObj = {
            hours: `${hoursNum.toFixed(1)}h`,
            battles: String(battlesNum),
            rankTitle: df.rankTitle,
            rankScore: `Score: ${parseInt(df.rankScore.replace(/\D/g, '')) + 80}`,
            avgProfit: df.detailsStats.find(s => s.key === "Avg. Profit/Loss").val,
            totalExtracted: `${currentExtracted.toFixed(1)}b`,
            missionRewards: df.detailsStats.find(s => s.key === "Mission Rewards").val,
            kdRatio: df.detailsStats.find(s => s.key === "Avg. K/D Ratio").val,
            kills: currentKills.toLocaleString(),
            accuracy: df.detailsStats.find(s => s.key === "Overall Accuracy").val,
            lethality: df.detailsStats.find(s => s.key === "Lethality Rate").val,
            extractionRate: df.detailsStats.find(s => s.key === "Extraction Rate").val
          };

          localStorage.setItem('df_custom_stats', JSON.stringify(updatedStatsObj));
          loadLocalStorageData();
          selectGame('deltaforce', true);
        }

        btnManualSyncAction.disabled = false;
        btnManualSyncAction.classList.remove('loading');
        btnManualSyncAction.innerHTML = `SYNC NOW`;

        showHUDToast("sync complete", "Stats synchronized with Delta Force servers.");
      }, 1500);
    });
  }

  // Background Auto-Sync Simulator Timer
  let autoSyncInterval = null;
  const triggerAutoSyncUpdate = () => {
    const df = gameData.deltaforce;
    if (!df) return;

    if (Math.random() > 0.75) {
      const hoursNum = parseFloat(df.hours) + 0.3;
      const battlesNum = parseInt(df.battles) + 1;

      const getValStr = (key) => df.detailsStats.find(s => s.key === key).val;
      const currentKills = parseInt(getValStr("Operator Eliminations").replace(/\D/g, '')) + 2;

      const updatedStatsObj = {
        hours: `${hoursNum.toFixed(1)}h`,
        battles: String(battlesNum),
        rankTitle: df.rankTitle,
        rankScore: `Score: ${parseInt(df.rankScore.replace(/\D/g, '')) + 50}`,
        avgProfit: getValStr("Avg. Profit/Loss"),
        totalExtracted: getValStr("Total Extracted Value"),
        missionRewards: getValStr("Mission Rewards"),
        kdRatio: getValStr("Avg. K/D Ratio"),
        kills: currentKills.toLocaleString(),
        accuracy: getValStr("Overall Accuracy"),
        lethality: getValStr("Lethality Rate"),
        extractionRate: getValStr("Extraction Rate")
      };

      localStorage.setItem('df_custom_stats', JSON.stringify(updatedStatsObj));
      loadLocalStorageData();

      const isDFActive = currentActiveGameId === 'deltaforce';
      if (isDFActive) {
        selectGame('deltaforce', true);
      }

      showHUDToast("live update", `Match recorded! Playtime +0.3h, battles +1, kills +2`);
    }
  };

  const startAutoSync = () => {
    if (autoSyncInterval) clearInterval(autoSyncInterval);
    autoSyncInterval = setInterval(triggerAutoSyncUpdate, 60000);
  };

  const stopAutoSync = () => {
    if (autoSyncInterval) {
      clearInterval(autoSyncInterval);
      autoSyncInterval = null;
    }
  };

  // Auto sync switch toggle change listener
  if (chkAutoSync) {
    const savedAutoSync = localStorage.getItem('df_auto_sync') === 'true';
    chkAutoSync.checked = savedAutoSync;
    if (savedAutoSync) {
      startAutoSync();
    }

    chkAutoSync.addEventListener('change', (e) => {
      localStorage.setItem('df_auto_sync', e.target.checked);
      if (e.target.checked) {
        startAutoSync();
        showHUDToast("Auto-Sync active", "Live gameplay background simulation enabled.");
      } else {
        stopAutoSync();
        showHUDToast("Auto-Sync disabled", "Background simulator suspended.");
      }
    });
  }

  // Inicializar a página na tela inicial (Launcher de Jogos)
  resetToLauncher();

  // Inicializar tooltips para elementos estáticos com data attributes
  document.querySelectorAll('[data-tooltip-title]').forEach(el => {
    const title = el.getAttribute('data-tooltip-title');
    const desc = el.getAttribute('data-tooltip-desc') || '';
    const status = el.getAttribute('data-tooltip-status') || '';
    setupTooltip(el, title, desc, status);
  });

  // ══════════════════════════
  // EFEITO SPOTLIGHT AMBIENTE (SEGUIR CURSOR)
  // ══════════════════════════
  document.addEventListener('mousemove', (event) => {
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  });
});
