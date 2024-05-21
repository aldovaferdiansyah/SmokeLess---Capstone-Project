const tombol = document.querySelector('.tombol');
const menu = document.querySelector('.menu');
tombol.addEventListener('click', () => {
    menu.classList.toggle('aktif');
});