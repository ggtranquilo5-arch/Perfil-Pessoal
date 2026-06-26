document.addEventListener("DOMContentLoaded", () => {
  // Elementos da música e tela de entrada
  const audio = document.getElementById('bgAudio');
  const enterScreen = document.getElementById('enterScreen');
  const enterBtn = document.getElementById('enterBtn');
  const audBtn = document.getElementById('audBtn');
  const audioPanel = document.getElementById('audioPanel');
  const volRange = document.getElementById('vol');
  const audTog = document.getElementById('audTog');

  let isPlaying = false;

  // ══════════════════════════
  // TELA DE ENTRADA E AUTOPLAY
  // ══════════════════════════
  const startExperience = () => {
    // Esconder a tela de entrada com animação
    enterScreen.classList.add('gone');
    setTimeout(() => {
      enterScreen.style.display = 'none';
    }, 800);

    // Revelar o container principal e o botão de áudio
    document.body.classList.add('visible');

    // Tocar música com o volume inicial configurado
    audio.volume = volRange.value / 100;
    audio.play().then(() => {
      isPlaying = true;
      audBtn.classList.add('playing');
    }).catch(err => {
      console.log("Autoplay de áudio bloqueado pelo navegador. O usuário precisa interagir.", err);
    });

    // Iniciar a revelação progressiva das linhas da ficha (Dossier)
    revealDossierRows();
  };

  if (enterBtn) {
    enterBtn.addEventListener('click', startExperience);
  }

  // ══════════════════════════
  // PAINEL DE CONTROLE DE ÁUDIO
  // ══════════════════════════
  // Mostrar/ocultar painel de volume ao clicar no FAB de áudio
  audBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audioPanel.classList.toggle('open');
  });

  // Fechar o painel ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!audioPanel.contains(e.target) && e.target !== audBtn) {
      audioPanel.classList.remove('open');
    }
  });

  // Controlar o volume através do slider
  volRange.addEventListener('input', () => {
    audio.volume = volRange.value / 100;
    if (audio.volume > 0 && audio.paused) {
      audio.play();
      isPlaying = true;
      audTog.innerHTML = '<i class="fas fa-pause"></i>&nbsp; PAUSAR MÚSICA';
      audBtn.querySelector('i').className = 'fas fa-volume-up';
    }
  });

  // Alternar play/pause no painel
  audTog.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      audTog.innerHTML = '<i class="fas fa-play"></i>&nbsp; TOCAR MÚSICA';
      audBtn.querySelector('i').className = 'fas fa-volume-mute';
      audBtn.classList.remove('playing');
    } else {
      audio.play();
      audTog.innerHTML = '<i class="fas fa-pause"></i>&nbsp; PAUSAR MÚSICA';
      audBtn.querySelector('i').className = 'fas fa-volume-up';
      audBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

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

  // Iniciar relógio e atualizar a cada segundo
  updateClock();
  setInterval(updateClock, 1000);

  // ══════════════════════════
  // REVELAÇÃO DO DOSSIER (FICHA)
  // ══════════════════════════
  const revealDossierRows = () => {
    const rows = document.querySelectorAll('.dossier-rows .dr');
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('revealed');
      }, (index + 1) * 200); // 200ms de intervalo entre as linhas
    });
  };

  // ══════════════════════════
  // INTERATIVIDADE MOBILE (TOUCH)
  // ══════════════════════════
  const hudTags = document.querySelectorAll('.hud-tag');
  hudTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Fecha todas as outras tooltips
      hudTags.forEach(t => {
        if (t !== tag) t.classList.remove('show-tooltip');
      });

      // Alterna a classe de exibição
      tag.classList.toggle('show-tooltip');
    });
  });

  // Fechar tooltips das tags ao clicar na tela
  document.addEventListener('click', () => {
    hudTags.forEach(t => t.classList.remove('show-tooltip'));
  });
});
