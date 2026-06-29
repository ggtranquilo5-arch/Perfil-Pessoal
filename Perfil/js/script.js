document.addEventListener("DOMContentLoaded", () => {
  // Elementos do áudio
  const audio = document.getElementById('bgAudio');
  const audBtn = document.getElementById('audBtn');
  const audioLabel = document.getElementById('audioLabel');
  let isPlaying = false;

  if (audio) {
    audio.volume = 0.45;
  }

  // ══════════════════════════
  // CONTROLE DE ÁUDIO (HUD)
  // ══════════════════════════
  if (audBtn && audio) {
    audBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        audBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        audBtn.classList.remove('playing');
        if (audioLabel) audioLabel.textContent = 'ÁUDIO DESATIVADO';
      } else {
        audio.play().then(() => {
          audBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          audBtn.classList.add('playing');
          if (audioLabel) audioLabel.textContent = 'SISTEMA DE ÁUDIO';
        }).catch(err => {
          console.error("Autoplay de som falhou ou foi bloqueado:", err);
        });
      }
      isPlaying = !isPlaying;
    });
  }

  // ══════════════════════════
  // DADOS DOS JOGOS (DADOS REAIS COMPATÍVEIS E EMBLEMAS 3D)
  // ══════════════════════════
  const gameData = {
    deltaforce: {
      name: "Delta Force: Hawk Ops",
      rankTitle: "DF Pinnacle 🌟 44",
      rankScore: "Pontuação: 8150",
      hours: "73h",
      battles: "430",
      assets: "246.8M",
      extractionRate: "35.8%",
      opLevel: "60",
      titleName: "Deus da Guerra T6",
      titleDesc: "provante de alcançar a classificação mais alta na Zona de Risco, Temporada War Albaze!",
      
      // Foto de perfil oficial (local)
      avatarUrl: "img/deltaforce_avatar.jpg",

      // 8 emblemas equipados com shapes e cores
      equippedEmblems: [
        { name: "Boas-vindas à FD", icon: "fa-crosshairs", shape: "shape-shield", color: "cyan-emb" },
        { name: "Asas de Resgate", icon: "fa-helicopter", shape: "shape-shield", color: "cyan-emb" },
        { name: "Pioneiro da Linha", icon: "fa-medal", shape: "shape-triangle", color: "gold-emb" },
        { name: "Trabalho de Equipe", icon: "fa-users", shape: "shape-shield", color: "gold-emb" },
        { name: "Rosa Negra", icon: "fa-spa", shape: "shape-diamond", color: "blue-emb" },
        { name: "Elite de Combate", icon: "fa-skull-crossbones", shape: "shape-shield", color: "red-emb" },
        { name: "Escudo Verde", icon: "fa-shield-halved", shape: "shape-shield", color: "green-emb" },
        { name: "Medalha de Honra", icon: "fa-award", shape: "shape-shield", color: "gold-emb" }
      ],

      // Todos os 18 emblemas com formas 3D e cores correspondentes à imagem do jogo
      allEmblems: [
        { name: "Boas-vindas à FD", icon: "fa-crosshairs", equipped: true, desc: "Força Delta. Registro oficial de operador.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Asas de Resgate", icon: "fa-helicopter", equipped: true, desc: "Apoio tático e extração de helicóptero.", shape: "shape-shield", color: "cyan-emb" },
        { name: "Pioneiro da Linha", icon: "fa-font", equipped: true, desc: "Conquista de vanguarda no front.", shape: "shape-triangle", color: "gold-emb" },
        { name: "Trabalho de Equipe", icon: "fa-users", equipped: true, desc: "Cooperação ativa com esquadrão tático.", shape: "shape-shield", color: "gold-emb" },
        { name: "Rosa Negra", icon: "fa-seedling", equipped: true, desc: "Conclusão de operações silenciosas.", shape: "shape-diamond", color: "blue-emb" },
        { name: "Elite de Combate", icon: "fa-skull-crossbones", equipped: true, desc: "Letalidade máxima contra alvos hostis.", shape: "shape-shield", color: "red-emb" },
        { name: "Escudo Verde", icon: "fa-shield-halved", equipped: true, desc: "Defesa bem-sucedida de pontos críticos.", shape: "shape-shield", color: "green-emb" },
        { name: "Medalha de Honra", icon: "fa-award", equipped: true, desc: "Honraria por bravura em combate.", shape: "shape-shield", color: "gold-emb" },
        { name: "Mestre da Tática", icon: "fa-star-of-david", equipped: false, desc: "Estratégia de flanqueamento avançado.", shape: "shape-shield", color: "green-emb" },
        { name: "Pérola do Mar", icon: "fa-gem", equipped: true, desc: "Extração bem-sucedida de tesouros.", shape: "shape-circle", color: "gold-emb" },
        { name: "Sniper Fuzileiro", icon: "fa-bullseye", equipped: false, desc: "Precisão de longo alcance com rifles.", shape: "shape-shield", color: "blue-emb" },
        { name: "Lâmina Silenciosa", icon: "fa-slash", equipped: false, desc: "Eliminações furtivas corpo a corpo.", shape: "shape-shield", color: "blue-emb" },
        { name: "Lobo Cenográfico", icon: "fa-paw", equipped: false, desc: "Táticas de caça solo.", shape: "shape-diamond", color: "gold-emb" },
        { name: "Leão de Bronze", icon: "fa-cat", equipped: false, desc: "Defesa sob cerco pesado.", shape: "shape-shield", color: "gold-emb" },
        { name: "Leão de Ouro", icon: "fa-crown", equipped: false, desc: "Vitórias consecutivas na arena.", shape: "shape-shield", color: "gold-emb" },
        { name: "Engenharia Militar", icon: "fa-gear", equipped: true, desc: "Hacking e decodificação.", shape: "shape-circle", color: "gold-emb" },
        { name: "Cavaleiro de Ferro", icon: "fa-horse", equipped: false, desc: "Mobilidade tática rápida.", shape: "shape-diamond", color: "gold-emb" },
        { name: "Adagas Cruzadas", icon: "fa-bezier-curve", equipped: false, desc: "Coordenação de ataques em pinça.", shape: "shape-shield", color: "red-emb" }
      ],

      detailsStats: [
        { key: "Total de Batalhas", val: "430" },
        { key: "Hora do Jogo", val: "73h" },
        { key: "P/L (Média)", val: "1.4M" },
        { key: "Valor Extraído", val: "393.8M" },
        { key: "Recompensas de Tarefas", val: "1.2M" },
        { key: "MandelBricks Decodificados", val: "2" },
        { key: "Média A/M (K/D)", val: "13 | 2.5 | 1.4" },
        { key: "Eliminações de Operadores", val: "635" },
        { key: "Precisão Geral", val: "25.5%" },
        { key: "Taxa de Eliminação", val: "45.6%" },
        { key: "Taxa de Extração", val: "35.8%" },
        { key: "Valor Extraído de Aliados", val: "14.1M" },
        { key: "Resgate de Companheiros", val: "77" },
        { key: "Aliados Ressurgidos", val: "61" }
      ],

      radarPoints: "100,41 155,82 135,148 66,134 27,76",

      history: [
        { mode: "ZONA DE RISCO", desc: "Extração bem-sucedida (Echo)", status: "VITÓRIA", resultClass: "victory" },
        { mode: "ZONA DE RISCO", desc: "Extração bem-sucedida (Echo)", status: "VITÓRIA", resultClass: "victory" },
        { mode: "ZONA DE RISCO", desc: "Operador Eliminado (Echo)", status: "DERROTA", resultClass: "defeat" },
        { mode: "ZONA DE RISCO", desc: "Extração bem-sucedida (Echo)", status: "VITÓRIA", resultClass: "victory" }
      ]
    },
    rust: {
      name: "Rust",
      rankTitle: "Sobrevivente Alfa",
      rankScore: "Pontuação: 9200",
      hours: "1.200h",
      battles: "850",
      assets: "1.4B",
      extractionRate: "85.2%",
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
        { key: "Total de Wipes Jogados", val: "42" },
        { key: "Horas de Sobrevivência", val: "1.200h" },
        { key: "PVP Kills", val: "2,450" },
        { key: "Raids Executados", val: "84" },
        { key: "Recursos Coletados", val: "14.5M" },
        { key: "Helicópteros Derrubados", val: "16" }
      ],
      radarPoints: "100,25 168,75 140,155 60,155 32,75",
      history: [
        { mode: "Monument Raid", desc: "Monumento Airfield conquistado", status: "VITÓRIA", resultClass: "victory" },
        { mode: "Base Defense", desc: "Defesa de raid online bem sucedida", status: "VITÓRIA", resultClass: "victory" }
      ]
    },
    valorant: {
      name: "Valorant",
      rankTitle: "Ascendente III",
      rankScore: "Pontuação: RR 72",
      hours: "450h",
      battles: "380",
      assets: "45K VP",
      extractionRate: "58.4%",
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
      radarPoints: "100,30 162,75 142,150 64,148 30,75",
      history: [
        { mode: "COMPETITIVO", desc: "Partida ranqueada (Split - Jett)", status: "VITÓRIA", resultClass: "victory" },
        { mode: "COMPETITIVO", desc: "Partida ranqueada (Ascent - Jett)", status: "VITÓRIA", resultClass: "victory" },
        { mode: "COMPETITIVO", desc: "Partida ranqueada (Bind - Reyna)", status: "DERROTA", resultClass: "defeat" }
      ]
    },
    cs2: {
      name: "Counter-Strike 2",
      rankTitle: "Global Elite // Premier",
      rankScore: "Pontuação: 18,400",
      hours: "350h",
      battles: "290",
      assets: "6.2M Valor",
      extractionRate: "62.1%",
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
      radarPoints: "100,28 160,78 138,154 62,152 28,78",
      history: [
        { mode: "PREMIER", desc: "Partida ranqueada (Mirage - Terrorista)", status: "VITÓRIA", resultClass: "victory" },
        { mode: "PREMIER", desc: "Partida ranqueada (Inferno - CT)", status: "VITÓRIA", resultClass: "victory" }
      ]
    },
    gta5: {
      name: "Grand Theft Auto V",
      rankTitle: "Chefe do Crime Organizado",
      rankScore: "Pontuação: $120.4M",
      hours: "250h",
      battles: "150 Golpes",
      assets: "$120.4M",
      extractionRate: "82.4%",
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
      radarPoints: "100,32 165,75 138,150 62,148 26,75",
      history: [
        { mode: "GOLPE", desc: "Golpe a Cayo Perico (Elite)", status: "VITÓRIA", resultClass: "victory" },
        { mode: "GOLPE", desc: "Golpe ao Casino Diamond (Dinheiro)", status: "VITÓRIA", resultClass: "victory" }
      ]
    }
  };

  // Elementos do launcher de abas
  const tabsHeader = document.getElementById('tabsHeader');
  const tabGamesBtn = document.getElementById('tabGamesBtn');
  const backToGamesBtn = document.getElementById('backToGamesBtn');
  const gameTabs = document.querySelectorAll('.game-tab');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Lógica de seleção do jogo
  const launcherCards = document.querySelectorAll('.launcher-game-card');

  const selectGame = (gameId) => {
    const data = gameData[gameId];
    if (!data) return;

    // 1. Atualizar Abas do Header
    if (tabsHeader) tabsHeader.classList.add('game-active');
    if (tabGamesBtn) tabGamesBtn.classList.add('hidden');
    if (backToGamesBtn) backToGamesBtn.classList.remove('hidden');
    gameTabs.forEach(tab => tab.classList.remove('hidden'));

    // 2. Carregar informações reais na aba PERFIL
    document.getElementById('profileHeader').textContent = `// OPERADOR: ${data.name.toUpperCase()}`;
    document.getElementById('dfRankTitle').textContent = data.rankTitle;
    document.getElementById('dfRankScore').textContent = data.rankScore;
    document.getElementById('dfHours').textContent = data.hours;
    document.getElementById('dfBattles').textContent = data.battles;
    document.getElementById('dfAssets').textContent = data.assets;
    document.getElementById('dfExtractRate').textContent = data.extractionRate;
    document.getElementById('dfOpLevel').textContent = data.opLevel;
    document.getElementById('dfProfileTitle').textContent = data.titleName;

    // Atualizar avatar na aba Perfil
    const charAvatar = document.querySelector('.char-avatar-render');
    if (charAvatar) {
      charAvatar.src = data.avatarUrl;
    }

    // Grid de emblemas equipados com design de patch militar real
    const equippedGrid = document.getElementById('dfEquippedGrid');
    equippedGrid.innerHTML = '';
    data.equippedEmblems.forEach(emb => {
      const slot = document.createElement('div');
      slot.className = `df-ee-slot`;
      slot.title = emb.name;
      slot.innerHTML = `
        <div class="emblem-patch ${emb.shape} ${emb.color}">
          <i class="fas ${emb.icon}"></i>
        </div>
      `;
      equippedGrid.appendChild(slot);
    });

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
    document.getElementById('dfTitleName').textContent = data.titleName;
    document.getElementById('dfTitleDesc').textContent = data.titleDesc;

    // Grid de 18 emblemas com visual de patch militar real
    const allEmblemsGrid = document.getElementById('dfAllEmblemsGrid');
    allEmblemsGrid.innerHTML = '';
    
    const emblemsToLoad = data.allEmblems || [];
    emblemsToLoad.forEach(emb => {
      const card = document.createElement('div');
      card.className = `emblem-card-grid ${emb.equipped ? 'equipped' : ''}`;
      card.title = `${emb.name}: ${emb.desc}`;
      card.innerHTML = `
        <div class="emblem-patch ${emb.shape} ${emb.color}">
          <i class="fas ${emb.icon}"></i>
        </div>
      `;
      
      // Clique para exibir detalhes
      card.addEventListener('click', () => {
        alert(`${emb.name}\n${emb.desc}`);
      });
      allEmblemsGrid.appendChild(card);
    });

    // 5. Carregar histórico de partidas
    const historyList = document.getElementById('dfHistoryList');
    historyList.innerHTML = '';
    data.history.forEach(match => {
      const item = document.createElement('div');
      item.className = `history-item ${match.resultClass}`;
      item.innerHTML = `
        <span class="match-game">${match.mode}</span>
        <span class="match-desc">${match.desc}</span>
        <span class="match-status">${match.status}</span>
      `;
      historyList.appendChild(item);
    });

    // 6. Ativar aba de Perfil por padrão
    activateTab('perfil');
  };

  // Retornar ao launcher principal
  const resetToLauncher = () => {
    if (tabsHeader) tabsHeader.classList.remove('game-active');
    if (tabGamesBtn) tabGamesBtn.classList.remove('hidden');
    if (backToGamesBtn) backToGamesBtn.classList.add('hidden');
    gameTabs.forEach(tab => tab.classList.add('hidden'));

    // Reverter avatar na aba Perfil (local)
    const charAvatar = document.querySelector('.char-avatar-render');
    if (charAvatar) {
      charAvatar.src = 'img/29231.png';
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

  // ══════════════════════════
  // RELÓGIO DIGITAL ATIVO
  // ══════════════════════════
  const clockEl = document.getElementById('liveClock');
  const dateEl = document.getElementById('liveDate');

  const updateClock = () => {
    const now = new Date();
    
    // Formatar Horário
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    if (clockEl) {
      clockEl.textContent = `${hh}:${mm}:${ss}`;
    }

    // Formatar Data
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('pt-BR', options).toUpperCase();
    if (dateEl) {
      dateEl.textContent = dateStr;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);

  // ══════════════════════════
  // EFEITO SPOTLIGHT AMBIENTE (SEGUIR CURSOR)
  // ══════════════════════════
  document.addEventListener('mousemove', (event) => {
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  });
});
