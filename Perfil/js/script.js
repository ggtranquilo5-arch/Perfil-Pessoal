// Gerenciamento da Música de Fundo (MP3 / Áudio Fixo)
document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('musicToggle');
  const musicIcon = musicBtn.querySelector('i');
  
  let isPlaying = false;

  const toggleMusic = () => {
    if (isPlaying) {
      music.pause();
      musicIcon.classList.remove('fa-pause');
      musicIcon.classList.add('fa-music');
      musicBtn.classList.remove('playing');
    } else {
      music.volume = 0.5; // Ajuste de volume
      music.play().then(() => {
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
        musicBtn.classList.add('playing');
      }).catch(err => {
        console.log("Autoplay bloqueado pelo navegador. O usuário precisa clicar.", err);
      });
    }
    isPlaying = !isPlaying;
  };

  const tryAutoPlay = () => {
    if (!isPlaying) {
      toggleMusic();
    }
    document.removeEventListener('click', tryAutoPlay);
    document.removeEventListener('keydown', tryAutoPlay);
  };

  document.addEventListener('click', tryAutoPlay);
  document.addEventListener('keydown', tryAutoPlay);

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });
});
