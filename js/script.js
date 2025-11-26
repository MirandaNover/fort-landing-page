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
        message.classList.remove('is-visible', 'is-error');
      }
    };
    const showMessage = (text, variant = 'success') => {
      if (!message) return;
      hideMessage();
      message.textContent = text;
      if (variant === 'error') {
        message.classList.add('is-error');
      }
      message.classList.add('is-visible');
      messageTimeout = window.setTimeout(() => {
        hideMessage();
      }, 6500);
    };
    const clearSuccessState = () => {
      if (fieldWrapper) fieldWrapper.classList.remove('is-success');
      hideMessage();
    };
    const resetSubmissionState = () => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
      }
      delete form.dataset.submitting;
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
        if (fieldWrapper) {
          fieldWrapper.classList.add('is-success');
          setTimeout(() => fieldWrapper.classList.remove('is-success'), 5000);
        }
        showMessage("All set! We'll be in touch.");
        resetSubmissionState();
      };

      const showError = () => {
        showMessage('Something went wrong. Please try again.', 'error');
        resetSubmissionState();
      };

      fetch(form.action, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })
        .then(showSuccess)
        .catch(showError);
    });
  });
})();
