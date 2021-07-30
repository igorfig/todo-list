const menuBtn = document.querySelector('.menu-btn');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
    document.querySelector('.select-all-container').classList.remove('no-display')
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
    document.querySelector('.select-all-container').classList.add('no-display')
  }
});