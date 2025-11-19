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

// Logo fade on scroll
(function () {
  const hero = document.querySelector('.hero');
  const logo = document.querySelector('.top-logo img');

  if (!hero || !logo) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mobileQuery = window.matchMedia('(max-width: 639px)');

  const updateOpacity = () => {
    if (!mobileQuery.matches) {
      logo.style.opacity = '1';
      return;
    }

    const heroTop = hero.offsetTop;
    const heroHeight = hero.offsetHeight || 1;
    const progress = clamp((window.scrollY - heroTop) / heroHeight, 0, 1);
    const opacity = 1 - progress;
    logo.style.opacity = opacity.toFixed(3);
  };

  updateOpacity();
  window.addEventListener('scroll', updateOpacity, { passive: true });
  window.addEventListener('resize', updateOpacity);
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', updateOpacity);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(updateOpacity);
  }
})();

// Mailchimp inline submit
(function () {
  const forms = document.querySelectorAll('.mailchimp-form');
  if (!forms.length) return;

  forms.forEach(form => {
    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton ? submitButton.textContent : '';
    const messageEl = form.nextElementSibling && form.nextElementSibling.classList.contains('form-success-message')
      ? form.nextElementSibling
      : null;

    form.addEventListener('submit', event => {
      event.preventDefault();

      if (form.dataset.submitting === 'true') return;
      if (!form.reportValidity()) return;

      form.dataset.submitting = 'true';

      if (messageEl) {
        messageEl.classList.remove('is-visible');
        messageEl.setAttribute('hidden', '');
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting…';
      }

      const formData = new FormData(form);

      const showSuccess = () => {
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
        if (messageEl) {
          messageEl.removeAttribute('hidden');
          requestAnimationFrame(() => messageEl.classList.add('is-visible'));
          setTimeout(() => {
            messageEl.classList.remove('is-visible');
            messageEl.setAttribute('hidden', '');
          }, 6000);
        }
        delete form.dataset.submitting;
      };

      fetch(form.action, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })
        .catch(() => {})
        .finally(showSuccess);
    });
  });
})();
