const FULLSCREEN_DURATION = 300;
const PAIR_APPEAR_STAGGER = 300;
const PAIR_HOLD_DURATION = 300;
const MAILCHIMP_ENDPOINT = "https://fort.us19.list-manage.com/subscribe/post-json";

document.addEventListener("DOMContentLoaded", () => {
  initSlideshow();
  initMailchimpForms();
});

function initSlideshow() {
  const stage = document.getElementById("stage");
  if (!stage) {
    return;
  }

  prefetchImages();

  const allFiles = [
    "fullscreen1-woman-stretching-outdoor.png",
    "fullscreen2-woman-torso-green-outfit-closeup.png",
    "fullscreen3-man-benching.png",
    "l1-woman-olympic-lift-victory.png",
    "l2-gym.png",
    "l3-high-five.png",
    "l4-man-sunset.png",
    "l5-spa.png",
    "l6-yoga-mat-outside.png",
    "l7-woman-back.png",
    "r1-man-on-cliff.png",
    "r2-woman-posing-dark-green.png",
    "r3-row-man.png",
    "r4-women-on-floor.png",
    "r5-mike-mensler.png",
    "r6-hand-on-bar.png",
    "r7-guys-training.png",
  ];

  const fullscreenSlides = allFiles
    .filter((file) => file.startsWith("fullscreen"))
    .map((file) => ({ kind: "fullscreen", file }));

  const leftFiles = allFiles.filter((file) => file.startsWith("l"));
  const rightFiles = allFiles.filter((file) => file.startsWith("r"));
  const pairSlides = buildPairs(leftFiles, rightFiles).map(({ left, right }) => ({
    kind: "pair",
    left,
    right,
  }));

  const slides = spreadSlides(fullscreenSlides, pairSlides);
  if (!slides.length) {
    return;
  }

  stage.innerHTML = "";
  runShow(stage, slides);
}

async function runShow(stage, slides) {
  let pointer = 0;
  let activeElements = [];

  while (true) {
    const slide = slides[pointer];
    const nextElements = slide.kind === "fullscreen"
      ? await showFullscreen(stage, slide.file)
      : await showPair(stage, slide.left, slide.right);

    await wait(50);
    removeElements(activeElements);
    activeElements = nextElements;

    await wait(slide.kind === "fullscreen" ? FULLSCREEN_DURATION : PAIR_HOLD_DURATION);

    pointer += 1;
    if (pointer >= slides.length) {
      pointer = 0;
    }
  }
}

function prefetchImages() {
  const cache = new Map();
  const sources = [
    "fullscreen1-woman-stretching-outdoor.png",
    "fullscreen2-woman-torso-green-outfit-closeup.png",
    "fullscreen3-man-benching.png",
    "l1-woman-olympic-lift-victory.png",
    "l2-gym.png",
    "l3-high-five.png",
    "l4-man-sunset.png",
    "l5-spa.png",
    "l6-yoga-mat-outside.png",
    "l7-woman-back.png",
    "r1-man-on-cliff.png",
    "r2-woman-posing-dark-green.png",
    "r3-row-man.png",
    "r4-women-on-floor.png",
    "r5-mike-mensler.png",
    "r6-hand-on-bar.png",
    "r7-guys-training.png",
  ];

  sources.forEach((file) => {
    if (cache.has(file)) {
      return;
    }
    const img = new Image();
    img.src = `images/moodboard/${file}`;
    cache.set(file, img);
  });
}

async function showFullscreen(stage, file) {
  const image = createImageElement(file, "fullscreen");
  stage.appendChild(image);
  image.classList.add("is-visible");
  return [image];
}

async function showPair(stage, leftFile, rightFile) {
  const leftImage = createImageElement(leftFile, "left");
  const rightImage = createImageElement(rightFile, "right");
  const appearOrder = Math.random() > 0.5 ? [leftImage, rightImage] : [rightImage, leftImage];

  stage.appendChild(appearOrder[0]);
  appearOrder[0].classList.add("is-visible");
  await wait(PAIR_APPEAR_STAGGER);
  stage.appendChild(appearOrder[1]);
  appearOrder[1].classList.add("is-visible");
  return [leftImage, rightImage];
}

function createImageElement(file, alignment) {
  const img = document.createElement("img");
  img.src = `images/moodboard/${file}`;
  img.alt = buildAltText(file);
  img.loading = "lazy";
  img.classList.add("stage-image", `stage-image--${alignment}`);
  return img;
}

function buildPairs(leftFiles, rightFiles) {
  const leftMap = indexBySuffix(leftFiles);
  const rightMap = indexBySuffix(rightFiles);
  const sharedKeys = Object.keys(leftMap).filter((key) => rightMap[key]);
  sharedKeys.sort((a, b) => Number(a) - Number(b));
  return sharedKeys.map((key) => ({ left: leftMap[key], right: rightMap[key] }));
}

function indexBySuffix(files) {
  return files.reduce((acc, file) => {
    const suffix = extractPairIndex(file);
    if (suffix) {
      acc[suffix] = file;
    }
    return acc;
  }, {});
}

function extractPairIndex(file) {
  const match = file.match(/^[lr](\d+)/i);
  return match ? match[1] : null;
}

function spreadSlides(fullscreen, pairs) {
  if (!fullscreen.length) {
    return pairs.slice();
  }
  if (!pairs.length) {
    return fullscreen.slice();
  }

  const result = [];
  const spacing = Math.max(1, Math.ceil(pairs.length / fullscreen.length));
  let pairIndex = 0;
  let fullscreenIndex = 0;

  while (pairIndex < pairs.length) {
    for (let i = 0; i < spacing && pairIndex < pairs.length; i += 1) {
      result.push(pairs[pairIndex]);
      pairIndex += 1;
    }

    if (fullscreenIndex < fullscreen.length) {
      result.push(fullscreen[fullscreenIndex]);
      fullscreenIndex += 1;
    }
  }

  while (fullscreenIndex < fullscreen.length) {
    result.push(fullscreen[fullscreenIndex]);
    fullscreenIndex += 1;
  }

  return result;
}

function removeElements(elements) {
  elements.forEach((element) => {
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
  });
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function buildAltText(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim();
}

function initMailchimpForms() {
  const forms = document.querySelectorAll(".mailchimp-form");
  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    const submitButton = form.querySelector("button[type='submit']");
    const emailInput = form.querySelector("input[type='email']");
    const message = form.querySelector(".mailchimp-message");
    let messageTimeout;

    const hideMessage = () => {
      if (messageTimeout) {
        clearTimeout(messageTimeout);
        messageTimeout = null;
      }
      if (message) {
        message.textContent = "";
        message.classList.remove("is-visible", "is-error");
      }
    };

    const showMessage = (text, variant = "success") => {
      if (!message) {
        return;
      }
      hideMessage();
      message.textContent = text;
      if (variant === "error") {
        message.classList.add("is-error");
      }
      message.classList.add("is-visible");
      messageTimeout = window.setTimeout(() => {
        hideMessage();
      }, 6500);
    };

    const resetSubmissionState = () => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");
      }
      delete form.dataset.submitting;
    };

    const validateEmail = () => {
      if (!emailInput) {
        return "Please enter your email.";
      }
      const trimmedValue = emailInput.value.trim();
      emailInput.value = trimmedValue;
      if (!trimmedValue) {
        return "Please enter your email.";
      }
      if (!emailInput.validity.valid) {
        return "Please use a valid email address.";
      }
      return null;
    };

    emailInput?.addEventListener("input", () => {
      hideMessage();
    });
    emailInput?.addEventListener("focus", () => {
      hideMessage();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (form.dataset.submitting === "true") {
        return;
      }

      const validationError = validateEmail();
      if (validationError) {
        showMessage(validationError, "error");
        emailInput?.focus();
        return;
      }

      form.dataset.submitting = "true";
      hideMessage();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("is-loading");
      }

      const formData = new FormData(form);

      submitMailchimp(formData)
        .then((response) => {
          if (response?.result === "success") {
            form.reset();
            showMessage(cleanMailchimpMessage(response.msg) || "All set! We'll be in touch.");
          } else {
            showMessage(cleanMailchimpMessage(response?.msg) || "Something went wrong. Please try again.", "error");
          }
          resetSubmissionState();
        })
        .catch(() => {
          showMessage("Something went wrong. Please try again.", "error");
          resetSubmissionState();
        });
    });
  });
}

function submitMailchimp(formData) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        params.append(key, value);
      }
    });

    const callbackName = `mcCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    params.set("c", callbackName);

    const script = document.createElement("script");
    script.src = `${MAILCHIMP_ENDPOINT}?${params.toString()}`;
    script.async = true;

    const cleanup = () => {
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    window[callbackName] = (response) => {
      cleanup();
      resolve(response);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Mailchimp request failed"));
    };

    document.body.appendChild(script);
  });
}

function cleanMailchimpMessage(message) {
  if (!message || typeof message !== "string") {
    return "";
  }
  const temp = document.createElement("div");
  temp.innerHTML = message;
  return temp.textContent || temp.innerText || "";
}

