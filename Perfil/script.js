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

  if (introOverlay) {
    let activeBoot = true;

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

    // 2. Estatísticas Flutuantes HUD Piscando
    const statsInterval = setInterval(() => {
      if (!activeBoot) {
        clearInterval(statsInterval);
        return;
      }
      if (pingEl) pingEl.textContent = Math.floor(Math.random() * 9) + 20; // 20-28
      if (tempEl) tempEl.textContent = Math.floor(Math.random() * 5) + 39; // 39-43
      if (flowEl) flowEl.textContent = (Math.random() * 5 + 95).toFixed(1) + "%"; // 95% - 99.9%
      if (decryptEl) {
        const keys = ["0x7F2A", "0x3B8C", "0x9E1D", "0x5A4F", "0x2C7E", "0x8D3B"];
        decryptEl.textContent = keys[Math.floor(Math.random() * keys.length)];
      }
    }, 120);

    // 3. Sequência de Mensagens de Inicialização Dinâmica
    const bootMessages = [
      "SYSTEM INITIALIZING...",
      "CONNECTING TO OPERATOR NETWORK...",
      "DECRYPTING SECURITY CREDENTIALS...",
      "LOADING HUD VISUAL PROTOCOLS...",
      "BOOTING HOLOGRAPHIC CONSOLE...",
      "ACCESS GRANTED. BOOTING CONSOLE..."
    ];

    let messageIndex = 0;
    const bootInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex >= bootMessages.length) {
        clearInterval(bootInterval);
        activeBoot = false;

        // Finalizar carregamento e sumir com a intro
        setTimeout(() => {
          introOverlay.classList.add('fade-out');
          // Disparar animação staggered das seções principais adicionando a classe ao body
          document.body.classList.add('boot-complete');

          setTimeout(() => {
            smokeActive = false; // Parar loop da animação do canvas para poupar CPU/GPU
            introOverlay.remove();
          }, 900);
        }, 300);
      } else {
        if (introTerminal) {
          introTerminal.textContent = bootMessages[messageIndex];
        }
      }
    }, 280); // Transição total de ~1.7s para manter o carregamento fluido e não cansativo
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
        finalX = e.clientX - tooltipW - offset;
      }
      if (y + tooltipH > windowH) {
        finalY = e.clientY - tooltipH - offset;
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
      rankTitle: "DF Pinnacle 🌟 245",
      rankScore: "Pontuação: 23150",
      hours: "4700h",
      battles: "11430",
      assets: "266.8M",
      extractionRate: "39.8%",
      opLevel: "60",
      titleName: "Deus da Guerra T6",
      titleDesc: "provante de alcançar a classificação mais alta na Zona de Risco, Temporada War Albaze!",
      titles: [
        { name: "S9 God of War", id: "t9", file: "Screenshot_2026-07-01-15-17-13-442_com.garena.game.df.png", desc: "Temporada 9 - Classificação Deus da Guerra" },
        { name: "Deus da Guerra T8", id: "t8", file: "Screenshot_2026-07-01-15-17-50-703_com.garena.game.df.png", desc: "Temporada 8 - Classificação Deus da Guerra" },
        { name: "Deus da Guerra T7", id: "t7", file: "Screenshot_2026-07-01-15-17-28-310_com.garena.game.df.png", desc: "Temporada 7 - Classificação Deus da Guerra" },
        { name: "Deus da Guerra T6", id: "t6", file: "Screenshot_2026-07-01-15-18-04-634_com.garena.game.df.png", desc: "Temporada 6 - Classificação Deus da Guerra" },
        { name: "Deus da Guerra T5", id: "t5", file: "Screenshot_2026-07-01-15-18-17-734_com.garena.game.df.png", desc: "Temporada 5 - Classificação Deus da Guerra" },
        { name: "Deus da Guerra T4", id: "t4", file: "Screenshot_2026-07-01-15-18-32-566_com.garena.game.df.png", desc: "Temporada 4 - Classificação Deus da Guerra" }
      ],
      activeTitleId: "t6",

      // Foto de perfil oficial (local)
      avatarUrl: "img/deltaforce_avatar.jpg",

      // 6 emblemas equipados com shapes e cores (reduzido para economizar espaço e evitar overflow)
      equippedEmblems: [
        { name: "Boas-vindas à FD", icon: "fa-crosshairs", shape: "shape-shield", color: "cyan-emb", spriteIndex: 0 },
        { name: "Asas de Resgate", icon: "fa-helicopter", shape: "shape-shield", color: "cyan-emb", spriteIndex: 1 },
        { name: "Pioneiro da Linha", icon: "fa-medal", shape: "shape-triangle", color: "gold-emb", spriteIndex: 2 },
        { name: "Trabalho de Equipe", icon: "fa-users", shape: "shape-shield", color: "gold-emb", spriteIndex: 3 },
        { name: "Rosa Negra", icon: "fa-spa", shape: "shape-diamond", color: "blue-emb", spriteIndex: 4 },
        { name: "Elite de Combate", icon: "fa-skull-crossbones", shape: "shape-shield", color: "red-emb", spriteIndex: 5 }
      ],

      // Todos os 16 emblemas com formas 3D e cores correspondentes à imagem do jogo
      allEmblems: [
        { name: "Boas-vindas à FD", icon: "fa-crosshairs", equipped: true, desc: "Registro oficial do operador:21/04/2025.", shape: "shape-shield", color: "cyan-emb", spriteIndex: 0 },
        { name: "Asas de Resgate", icon: "fa-helicopter", equipped: true, desc: "Apoio tático e extração de helicóptero.", shape: "shape-shield", color: "cyan-emb", spriteIndex: 1 },
        { name: "Pioneiro da Linha", icon: "fa-font", equipped: true, desc: "Conquista de vanguarda no front.", shape: "shape-triangle", color: "gold-emb", spriteIndex: 2 },
        { name: "Trabalho de Equipe", icon: "fa-users", equipped: true, desc: "Cooperação ativa com esquadrão tático.", shape: "shape-shield", color: "gold-emb", spriteIndex: 3 },
        { name: "Rosa Negra", icon: "fa-seedling", equipped: true, desc: "Conclusão de operações silenciosas.", shape: "shape-diamond", color: "blue-emb", spriteIndex: 4 },
        { name: "Elite de Combate", icon: "fa-skull-crossbones", equipped: true, desc: "Letalidade máxima contra alvos hostis.", shape: "shape-shield", color: "red-emb", spriteIndex: 5 },
        { name: "Coração da África", icon: "fa-shield-halved", equipped: true, desc: "Referente ao raríssimo diamante Coração da África quando encontrado e extraído com sucesso na Zona de Risco.", shape: "shape-shield", color: "green-emb", spriteIndex: 6 },
        { name: "Pérola do Mar", icon: "fa-gem", equipped: false, desc: "Extração bem-sucedida de tesouros.", shape: "shape-circle", color: "gold-emb", spriteIndex: 7 },
        { name: "Sniper Fuzileiro", icon: "fa-bullseye", equipped: false, desc: "Precisão de longo alcance com rifles.", shape: "shape-shield", color: "blue-emb", spriteIndex: 8 },
        { name: "Lâmina Silenciosa", icon: "fa-slash", equipped: false, desc: "Eliminações furtivas corpo a corpo.", shape: "shape-shield", color: "blue-emb", spriteIndex: 9 },
        { name: "Lobo Cenográfico", icon: "fa-paw", equipped: false, desc: "Táticas de caça solo.", shape: "shape-diamond", color: "gold-emb", spriteIndex: 10 },
        { name: "Leão de Bronze", icon: "fa-cat", equipped: false, desc: "Defesa sob cerco pesado.", shape: "shape-shield", color: "gold-emb", spriteIndex: 11 },
        { name: "Engenharia Militar", icon: "fa-gear", equipped: false, desc: "Hacking e decodificação.", shape: "shape-circle", color: "gold-emb", spriteIndex: 12 },
        { name: "Cavaleiro de Ferro", icon: "fa-horse", equipped: false, desc: "Mobilidade tática rápida.", shape: "shape-diamond", color: "gold-emb", spriteIndex: 13 },
        { name: "Adagas Cruzadas", icon: "fa-bezier-curve", equipped: false, desc: "Coordenação de ataques em pinça.", shape: "shape-shield", color: "red-emb", spriteIndex: 14 },
        { name: "Leão de Ouro", icon: "fa-crown", equipped: false, desc: "Vitórias consecutivas na arena.", shape: "shape-shield", color: "gold-emb", spriteIndex: 15 }
      ],

      detailsStats: [
        { key: "Total de Batalhas", val: "11430" },
        { key: "Hora do Jogo", val: "4700h" },
        { key: "P/L (Média)", val: "1.4M" },
        { key: "Valor Extraído", val: "4.8b" },
        { key: "Recompensas de Tarefas", val: "1.8M" },
        { key: "MandelBricks Decodificados", val: "122" },
        { key: "Média A/M (K/D)", val: "13 | 3.3 | 1.9" },
        { key: "Eliminações de Operadores", val: "37.719" },
        { key: "Precisão Geral", val: "35.5%" },
        { key: "Taxa de Eliminação", val: "45.6%" },
        { key: "Taxa de Extração", val: "39.8%" },
        { key: "Valor Extraído de Aliados", val: "18.1M" },
        { key: "Resgate de Companheiros", val: "832" },
        { key: "Aliados Ressurgidos", val: "832" }
      ],

      radarPoints: "100,41 155,82 135,148 66,134 27,76"
    },
    rust: {
      name: "Rust",
      rankTitle: "Sobrevivente Alfa",
      rankScore: "Pontuação: 9200",
      hours: "5.200h",
      battles: "854",
      opLevel: "95",
      titleName: "Rei do AK",
      titleDesc: "Conquistou o domínio absoluto dos monumentos mais disputados do mapa.",

      // Foto de perfil do Rust (local)
      avatarUrl: "img/rust_avatar.jpg",

      equippedEmblems: [
        { name: "Sobrevivente", icon: "fa-radiation", shape: "shape-circle", color: "red-emb" },
        { name: "Pilhador", icon: "fa-box-open", shape: "shape-shield", color: "gold-emb" },
        { name: "Líder de Clã", icon: "fa-users", shape: "shape-shield", color: "cyan-emb" },
        { name: "Engenheiro", icon: "fa-hammer", shape: "shape-diamond", color: "green-emb" }
      ],
      allEmblems: [
        { name: "Sobrevivente", icon: "fa-radiation", equipped: true, desc: "Sobreviveu a 50 dias seguidos no wipe.", shape: "shape-circle", color: "red-emb" },
        { name: "Pilhador", icon: "fa-box-open", equipped: true, desc: "Saqueou 500 caixas militares.", shape: "shape-shield", color: "gold-emb" },
        { name: "Líder de Clã", icon: "fa-users", equipped: true, desc: "Liderou um clã de 8 membros.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Engenheiro", icon: "fa-hammer", equipped: true, desc: "Construiu uma base anti-raid.", shape: "shape-diamond", color: "green-emb" }
      ],
      detailsStats: [
        { key: "Total de Wipes Jogados", val: "854" },
        { key: "Horas de Sobrevivência", val: "5.200h" },
        { key: "PVP Kills", val: "3,450" },
        { key: "Raids Executados", val: "84" },
        { key: "Helicópteros Derrubados", val: "123" }
      ],
      radarPoints: "100,25 168,75 140,155 60,155 32,75"
    },
    valorant: {
      name: "Valorant",
      rankTitle: "Ascendente III",
      rankScore: "Pontuação: RR 72",
      hours: "450h",
      battles: "380",

      opLevel: "82",
      titleName: "Clutch Master",
      titleDesc: "Venceu mais de 100 rodadas jogando sozinho contra mais de 3 inimigos.",

      // Foto de perfil do Valorant (local)
      avatarUrl: "img/valorant_avatar.jpg",

      equippedEmblems: [
        { name: "Precisão", icon: "fa-crosshairs", shape: "shape-shield", color: "red-emb" },
        { name: "Suporte", icon: "fa-shield-halved", shape: "shape-shield", color: "cyan-emb" },
        { name: "MVP", icon: "fa-trophy", shape: "shape-circle", color: "gold-emb" },
        { name: "Dualista", icon: "fa-skull", shape: "shape-diamond", color: "blue-emb" }
      ],
      allEmblems: [
        { name: "Precisão", icon: "fa-crosshairs", equipped: true, desc: "Headshots acima de 28%.", shape: "shape-shield", color: "red-emb" },
        { name: "Suporte", icon: "fa-shield-halved", equipped: true, desc: "Forneceu 150 assistências.", shape: "shape-shield", color: "cyan-emb" },
        { name: "MVP", icon: "fa-trophy", equipped: true, desc: "MVP em partidas ranqueadas.", shape: "shape-circle", color: "gold-emb" },
        { name: "Dualista", icon: "fa-skull", equipped: true, desc: "Eliminou 30 inimigos em uma partida.", shape: "shape-diamond", color: "blue-emb" }
      ],
      detailsStats: [
        { key: "Partidas Competitivas", val: "380" },
        { key: "Horas Jogadas", val: "450h" },
        { key: "K/D Ratio Geral", val: "1.28" },
        { key: "Taxa de Vitória", val: "58.4%" },
        { key: "Precisão do Headshot", val: "28.3%" },
        { key: "Dano Médio por Rodada", val: "152" }
      ],
      radarPoints: "100,30 162,75 142,150 64,148 30,75"
    },
    cs2: {
      name: "Counter-Strike 2",
      rankTitle: "Global Elite // Premier",
      rankScore: "Pontuação: 18,400",
      hours: "350h",
      battles: "290",

      opLevel: "74",
      titleName: "Defusal Veteran",
      titleDesc: "Desarmou 50 bombas com menos de 2 segundos restantes.",

      // Foto de perfil do CS2 (local)
      avatarUrl: "img/Cs2 perfil.jpg",

      equippedEmblems: [
        { name: "Tactical", icon: "fa-bomb", shape: "shape-circle", color: "gold-emb" },
        { name: "Sharpshooter", icon: "fa-bullseye", shape: "shape-shield", color: "red-emb" },
        { name: "Líder", icon: "fa-crown", shape: "shape-shield", color: "cyan-emb" },
        { name: "Defensor", icon: "fa-shield", shape: "shape-diamond", color: "green-emb" }
      ],
      allEmblems: [
        { name: "Tactical", icon: "fa-bomb", equipped: true, desc: "Desarmou 100 bombas.", shape: "shape-circle", color: "gold-emb" },
        { name: "Sharpshooter", icon: "fa-bullseye", equipped: true, desc: "AWP ace na mesma rodada.", shape: "shape-shield", color: "red-emb" },
        { name: "Líder", icon: "fa-crown", equipped: true, desc: "Líder do lobby Premier.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Defensor", icon: "fa-shield", equipped: true, desc: "Segurou posições críticas do Bomb B.", shape: "shape-diamond", color: "green-emb" }
      ],
      detailsStats: [
        { key: "Partidas Premier", val: "290" },
        { key: "Horas Premier", val: "350h" },
        { key: "Média KDA", val: "1.34" },
        { key: "Headshots Efetuados", val: "67.8%" },
        { key: "MVP Total", val: "184" },
        { key: "Clutches Ganhos", val: "42" }
      ],
      radarPoints: "100,28 160,78 138,154 62,152 28,78"
    },
    gta5: {
      name: "Grand Theft Auto V",
      rankTitle: "Chefe do Crime Organizado",
      rankScore: "Pontuação: $120.4M",
      hours: "250h",
      battles: "150 Golpes",

      opLevel: "120",
      titleName: "Heist Mastermind",
      titleDesc: "Completou todos os golpes na dificuldade máxima com a mesma equipe e sem mortes.",
      avatarUrl: "img/Gta 5 avatar.jpg",
      equippedEmblems: [
        { name: "Motorista", icon: "fa-car", shape: "shape-circle", color: "gold-emb" },
        { name: "Pistoleiro", icon: "fa-gun", shape: "shape-shield", color: "red-emb" },
        { name: "Planejador", icon: "fa-mask", shape: "shape-shield", color: "cyan-emb" },
        { name: "Magnata", icon: "fa-money-bill-wave", shape: "shape-diamond", color: "green-emb" }
      ],
      allEmblems: [
        { name: "Motorista", icon: "fa-car", equipped: true, desc: "Venceu 50 corridas urbanas.", shape: "shape-circle", color: "gold-emb" },
        { name: "Pistoleiro", icon: "fa-gun", equipped: true, desc: "Eliminou 200 inimigos com headshots.", shape: "shape-shield", color: "red-emb" },
        { name: "Planejador", icon: "fa-mask", equipped: true, desc: "Planejou e executou o golpe sem alarmar.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Magnata", icon: "fa-money-bill-wave", equipped: true, desc: "Acumulou mais de 100 milhões no banco.", shape: "shape-diamond", color: "green-emb" }
      ],
      detailsStats: [
        { key: "Golpes Concluídos", val: "150" },
        { key: "Horas Jogadas", val: "250h" },
        { key: "K/D Geral no Online", val: "1.45" },
        { key: "Propriedades Adquiridas", val: "12" },
        { key: "Carros na Garagem", val: "45" },
        { key: "Nível de Procurado Máximo", val: "5 Estrelas" }
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

  const selectGame = (gameId, preserveTab = false) => {
    const data = gameData[gameId];
    if (!data) return;

    // 1. Atualizar Abas do Header
    if (tabsHeader) tabsHeader.classList.add('game-active');
    if (tabGamesBtn) tabGamesBtn.classList.add('hidden');
    if (tabAmigoBtn) tabAmigoBtn.classList.add('hidden');
    if (backToGamesBtn) backToGamesBtn.classList.remove('hidden');
    gameTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === 'conquistas' && gameId !== 'deltaforce') {
        tab.classList.add('hidden');
      } else {
        tab.classList.remove('hidden');
      }
    });

    // 2. Carregar informações reais na aba PERFIL
    document.getElementById('profileHeader').textContent = `// OPERADOR: ${data.name.toUpperCase()}`;
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
    document.getElementById('dfProfileTitle').textContent = data.titleName;

    // Atualizar avatar na aba Perfil
    const charAvatar = document.querySelector('#tab-perfil .char-avatar-render');
    if (charAvatar) {
      charAvatar.src = data.avatarUrl;
    }

    // Grid de emblemas equipados com design de patch militar real
    const equippedEmblemsContainer = document.querySelector('.df-equipped-emblems');
    if (equippedEmblemsContainer) {
      if (gameId === 'deltaforce') {
        equippedEmblemsContainer.style.display = 'block';
      } else {
        equippedEmblemsContainer.style.display = 'none';
      }
    }

    const equippedGrid = document.getElementById('dfEquippedGrid');
    equippedGrid.innerHTML = '';
    if (gameId === 'deltaforce' && data.equippedEmblems) {
      data.equippedEmblems.forEach(emb => {
        const slot = document.createElement('div');
        slot.className = `df-ee-slot`;

        const matchingEmb = data.allEmblems ? data.allEmblems.find(ae => ae.name === emb.name) : null;
        const desc = matchingEmb ? matchingEmb.desc : "Emblema militar equipado.";
        setupTooltip(slot, emb.name, desc, "EQUIPADO");

        if (emb.spriteIndex !== undefined && slicedEmblems[emb.spriteIndex]) {
          slot.innerHTML = `
            <div class="emblem-patch has-image">
              <img src="${slicedEmblems[emb.spriteIndex]}" alt="${emb.name}" class="emblem-img">
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
    document.getElementById('detailsHeader').textContent = `// DESEMPENHO EM ${data.name.toUpperCase()}`;
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
      radarPoly.setAttribute('points', data.radarPoints);
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
          <img src="img/titulos/${activeTitle.file}" alt="${activeTitle.name}" class="df-title-banner-img">
        `;
        const activeTitleImg = titleDisplay.querySelector('.df-title-banner-img');
        if (activeTitleImg) {
          setupTooltip(activeTitleImg, activeTitle.name, activeTitle.desc, "EQUIPADO");
        }
      }

      // Renderizar o grid de seleção de títulos
      if (titlesGrid) {
        titlesGrid.innerHTML = '';
        data.titles.forEach(title => {
          const titleCard = document.createElement('div');
          titleCard.className = `df-title-card-selector ${title.id === data.activeTitleId ? 'active' : ''}`;
          titleCard.innerHTML = `
            <img src="img/titulos/${title.file}" alt="${title.name}">
          `;

          setupTooltip(titleCard, title.name, title.desc, title.id === data.activeTitleId ? "EQUIPADO" : "DISPONÍVEL");

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
          <div class="df-title-display-fallback" id="dfTitleDisplayFallback">
            <i class="fas fa-ribbon"></i>
            <div class="df-td-info">
              <div class="df-td-name" id="dfTitleName">${data.titleName}</div>
              <div class="df-td-desc" id="dfTitleDesc">${data.titleDesc || ''}</div>
            </div>
          </div>
        `;
        const fallbackDisplay = document.getElementById('dfTitleDisplayFallback');
        if (fallbackDisplay) {
          setupTooltip(fallbackDisplay, data.titleName, data.titleDesc || "Título militar ativo.", "EQUIPADO");
        }
      }
    }

    // Grid de 18 emblemas com visual de patch militar real
    const allEmblemsGrid = document.getElementById('dfAllEmblemsGrid');
    allEmblemsGrid.innerHTML = '';

    const emblemsToLoad = data.allEmblems || [];
    emblemsToLoad.forEach(emb => {
      const card = document.createElement('div');
      card.className = `emblem-card-grid ${emb.equipped ? 'equipped' : ''}`;

      setupTooltip(card, emb.name, emb.desc, emb.equipped ? "ADQUIRIDO" : "BLOQUEADO");

      if (emb.spriteIndex !== undefined && slicedEmblems[emb.spriteIndex]) {
        card.innerHTML = `
          <div class="emblem-patch has-image">
            <img src="${slicedEmblems[emb.spriteIndex]}" alt="${emb.name}" class="emblem-img">
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
