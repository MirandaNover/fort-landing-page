// Mailchimp inline submit
(function () {
  const forms = document.querySelectorAll('.mailchimp-form');
  if (!forms.length) return;

  forms.forEach(form => {
    const submitButton = form.querySelector('button[type="submit"]');
    const fieldWrapper = form.querySelector('.mailchimp-field');
    const emailInput = form.querySelector('input[type="email"]');
    const message = form.querySelector('.mailchimp-message');
    let messageTimeout;
    const hideMessage = () => {
      if (messageTimeout) {
        clearTimeout(messageTimeout);
        messageTimeout = null;
      }
      if (message) {
        message.textContent = '';
        message.classList.remove('is-visible');
      }
    };
    const clearSuccessState = () => {
      if (fieldWrapper) fieldWrapper.classList.remove('is-success');
      hideMessage();
    };

    if (emailInput) {
      emailInput.addEventListener('input', clearSuccessState);
      emailInput.addEventListener('focus', clearSuccessState);
    }

    form.addEventListener('submit', event => {
      event.preventDefault();

      if (form.dataset.submitting === 'true') return;
      if (!form.reportValidity()) return;

      form.dataset.submitting = 'true';
      clearSuccessState();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('is-loading');
      }

      const formData = new FormData(form);

      const showSuccess = () => {
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove('is-loading');
        }
        if (fieldWrapper) {
          fieldWrapper.classList.add('is-success');
          setTimeout(() => fieldWrapper.classList.remove('is-success'), 5000);
        }
        if (message) {
          message.textContent = 'All set! We\'ll be in touch.';
          message.classList.add('is-visible');
          messageTimeout = window.setTimeout(() => {
            hideMessage();
          }, 6500);
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
