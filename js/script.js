// Swiper Init
const swiper = new Swiper('.swiper', {
  speed: 500,
  spaceBetween: 28,
  slidesPerView: 3,
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// Logo color shift on scroll
(function () {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const insights = document.querySelector('#insights');
  const logo = document.querySelector('.top-logo img');

  if (!hero || !insights || !logo) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateLogo = () => {
    const start = hero.offsetTop;
    const end = insights.offsetTop;
    const range = Math.max(end - start, 1);
    const progress = clamp((window.scrollY - start) / range, 0, 1);
    root.style.setProperty('--logo-invert', progress.toFixed(3));
  };

  updateLogo();
  window.addEventListener('scroll', updateLogo, { passive: true });
  window.addEventListener('resize', updateLogo);
})();
