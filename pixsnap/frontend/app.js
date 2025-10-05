import { API_BASE_URL } from './config.js';
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const cameraBtn = document.getElementById('camera-btn');
const cameraModal = document.getElementById('camera-modal');
const cameraVideo = document.getElementById('camera-video');
const cameraCaptureBtn = document.getElementById('camera-capture');
const cameraCancelBtn = document.getElementById('camera-cancel');
const cameraCloseBtn = document.getElementById('camera-close');
const logoutBtn = document.getElementById('logout-btn');
const generateBtn = document.getElementById('generate-btn');
const previews = document.getElementById('previews');
const promptInput = document.getElementById('prompt');
const resultText = document.getElementById('result-text');
const resultImages = document.getElementById('result-images');
const generationAudio = document.getElementById('generation-audio');
const promptCarousel = document.getElementById('prompt-carousel');
const promptNavButtons = document.querySelectorAll('[data-prompt-nav]');

const MAX_FILES = 6;
const NO_IMAGE_ALERT = 'Add at least one picture. Start with a photo of you so the magic knows who to dress up.';
let items = [];
let cameraStream = null;
let selectedPromptButton = null;
let isPromptCarouselLocked = false;
let isGenerating = false;
let pendingPromptAutoRun = false;

const promptIdeas = [
  {
    id: 'princess-costume',
    title: 'Princess Costume',
    description: 'Glitter cape, twirl skirt, and a friendly tiara.',
    prompt: 'Create a princess costume with a pastel twirl dress, a shimmer cape, and comfy sparkly shoes. Add gentle sparkles and a playful tiara so it feels magical and easy to play in.',
    badge: 'PC',
    colors: ['#ffd1f7', '#ffe9fb'],
    badgeImage: './public/princess-costume.png',
  },
  {
    id: 'space-crew',
    title: 'Space Explorer Suit',
    description: 'Galaxy jacket, starlight boots, and comfy helmet.',
    prompt: 'Design a space explorer outfit with a midnight blue jacket, glowing stars on the sleeves, and safe magnet boots. Add gentle rocket patches and a soft helmet with a clear visor.',
    badge: 'SE',
    colors: ['#d6e8ff', '#c9f1ff'],
  },
  {
    id: 'pirate-parade',
    title: 'Pirate Parade',
    description: 'Striped vest, treasure map belt, and sea hat.',
    prompt: 'Create a pirate parade costume with a bright striped vest, a treasure map belt, and a friendly sea captain hat. Include soft boots and a parrot badge for giggles.',
    badge: 'PP',
    colors: ['#ffe7c3', '#ffd4c4'],
  },
  {
    id: 'dino-discovery',
    title: 'Dino Discovery',
    description: 'Leafy cape, pocket fossils, and dino tail.',
    prompt: 'Make a dino discovery outfit with a leafy green cape, pockets for pretend fossils, and a soft dinosaur tail. Add cozy sneakers with tiny dino tracks.',
    badge: 'DD',
    colors: ['#e1ffd1', '#c8f5c1'],
  },
  {
    id: 'ocean-hero',
    title: 'Ocean Hero',
    description: 'Wave jacket, bubble wand, and coral crown.',
    prompt: 'Design an ocean hero costume with a shimmering wave jacket, a bubble wand accessory, and a coral crown. Use sea glass colors and keep everything splash-friendly and comfy.',
    badge: 'OH',
    colors: ['#c6f5ff', '#d4ecff'],
  },
  {
    id: 'jungle-safari',
    title: 'Jungle Safari',
    description: 'Explorer vest, animal patches, and vine scarf.',
    prompt: 'Create a jungle safari look with a breezy explorer vest, animal friendship patches, and a soft vine scarf. Include sturdy play shoes and a tiny binocular necklace.',
    badge: 'JS',
    colors: ['#e8f7d8', '#f5efd1'],
  },
  {
    id: 'winter-wonder',
    title: 'Winter Wonder',
    description: 'Snowflake cape, fuzzy mitts, and warm boots.',
    prompt: 'Design a winter wonder outfit with a sparkling snowflake cape, fuzzy mittens, and warm starry boots. Add a cozy beanie with a pom-pom and gentle pastel colors.',
    badge: 'WW',
    colors: ['#e7f1ff', '#f2f6ff'],
  },
  {
    id: 'festival-popstar',
    title: 'Festival Pop Star',
    description: 'Rainbow jacket, musical belt, and confetti shoes.',
    prompt: 'Create a festival pop star costume with a rainbow jacket, a musical note belt, and confetti sparkle shoes. Include a microphone bracelet and bright stage lights on the sleeves.',
    badge: 'FP',
    colors: ['#ffd6f2', '#ffe8d6'],
  },
  {
    id: 'science-lab',
    title: 'Science Lab Hero',
    description: 'Color lab coat, gadget gloves, and glow goggles.',
    prompt: 'Design a science lab hero outfit with a colorful lab coat, glow-in-the-dark goggles, and soft gadget gloves. Add pockets for experiment cards and comfy sneakers.',
    badge: 'SL',
    colors: ['#dff6ff', '#e6e9ff'],
  },
];

const surpriseBits = {
  colors: ['cotton candy', 'midnight blue', 'sunset orange', 'minty fresh', 'glittering starlight', 'bubblegum pink', 'neon lime'],
  characters: ['space explorer', 'forest fairy', 'underwater scientist', 'robot inventor', 'adventure chef', 'dino ranger'],
  settings: ['ready for a moon parade', 'perfect for a school talent show', 'for a sunny park playdate', 'made for a secret mission', 'for a royal tea party', 'for a snowy festival'],
  extras: ['a cape that shimmers when you twirl', 'pockets filled with friendly gadgets', 'a hat that lights up with glow stars', 'a backpack covered in stickers', 'soft gloves with sparkling patterns', 'boots that leave rainbow footprints'],
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const toTitleCase = (value) => value.replace(/\b\w/g, (match) => match.toUpperCase());

const createPromptCard = (idea) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'prompt-card';
  button.setAttribute('role', 'listitem');
  button.setAttribute('aria-pressed', 'false');
  button.dataset.promptId = idea.id;
  if (idea.type) {
    button.dataset.promptType = idea.type;
  }
  if (idea.prompt) {
    button.dataset.promptValue = idea.prompt;
  }
  if (Array.isArray(idea.colors) && idea.colors.length) {
    button.style.setProperty('--prompt-card-start', idea.colors[0]);
    button.style.setProperty('--prompt-card-end', idea.colors[1] || idea.colors[0]);
  }
  const badgeContent = idea.badgeImage
    ? `<img src="${idea.badgeImage}" alt="" class="prompt-card__badge-image" draggable="false">`
    : `<span class="prompt-card__badge">${idea.badge || 'PP'}</span>`;
  button.innerHTML = `
    <span class="prompt-card__art" aria-hidden="true">
      ${badgeContent}
    </span>
    <span class="prompt-card__label">${idea.title}</span>
    <span class="prompt-card__hint">${idea.description || ''}</span>
  `;
  return button;
};

const updateSelectedPrompt = (button, promptValue, { focus = true } = {}) => {
  if (!button) {
    return;
  }

  if (selectedPromptButton && selectedPromptButton !== button) {
    selectedPromptButton.classList.remove('is-selected');
    selectedPromptButton.setAttribute('aria-pressed', 'false');
  }

  selectedPromptButton = button;
  selectedPromptButton.classList.add('is-selected');
  selectedPromptButton.setAttribute('aria-pressed', 'true');
  selectedPromptButton.dataset.promptValue = promptValue;

  if (promptInput) {
    promptInput.value = promptValue;
    if (focus) {
      promptInput.focus({ preventScroll: true });
    }
  }
};

const lockPromptCarousel = () => {
  if (!promptCarousel || isPromptCarouselLocked) {
    return;
  }

  isPromptCarouselLocked = true;
  promptCarousel.classList.add('is-locked');
  promptCarousel.setAttribute('aria-disabled', 'true');

  promptCarousel.querySelectorAll('.prompt-card').forEach((cardButton) => {
    cardButton.disabled = true;
    cardButton.setAttribute('aria-disabled', 'true');
  });

  promptNavButtons.forEach((button) => {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  });
};

const unlockPromptCarousel = () => {
  if (!promptCarousel || !isPromptCarouselLocked) {
    return;
  }

  isPromptCarouselLocked = false;
  promptCarousel.classList.remove('is-locked');
  promptCarousel.removeAttribute('aria-disabled');

  promptCarousel.querySelectorAll('.prompt-card').forEach((cardButton) => {
    cardButton.disabled = false;
    cardButton.removeAttribute('aria-disabled');
  });

  promptNavButtons.forEach((button) => {
    button.disabled = false;
    button.removeAttribute('aria-disabled');
  });
};

const buildSurprisePrompt = () => {
  const color = pickRandom(surpriseBits.colors);
  const character = pickRandom(surpriseBits.characters);
  const setting = pickRandom(surpriseBits.settings);
  const extra = pickRandom(surpriseBits.extras);
  const title = `Surprise: ${toTitleCase(`${color} ${character}`)}`;
  const hint = `Mix-ins: ${toTitleCase(character)}, ${color}, ${extra}`;
  const prompt = `Design a ${color} ${character} outfit ${setting}. Include ${extra} and keep everything soft, safe, and playful for kids.`;
  return { title, hint, prompt };
};

const applySurpriseToCard = (button) => {
  const surprise = buildSurprisePrompt();
  button.dataset.promptValue = surprise.prompt;
  const label = button.querySelector('.prompt-card__label');
  const hint = button.querySelector('.prompt-card__hint');
  if (label) {
    label.textContent = surprise.title;
  }
  if (hint) {
    hint.textContent = surprise.hint;
  }
  return surprise.prompt;
};

const autoGenerateFromPrompt = () => {
  if (!generateBtn) {
    return;
  }

  if (!items.length) {
    alert(NO_IMAGE_ALERT);
    return;
  }

  if (isGenerating) {
    pendingPromptAutoRun = true;
    return;
  }

  pendingPromptAutoRun = false;
  generate();
};

const setupPromptCarousel = () => {
  if (!promptCarousel || promptCarousel.dataset.enhanced === 'true') {
    return;
  }

  const fragment = document.createDocumentFragment();
  promptIdeas.forEach((idea) => {
    const card = createPromptCard(idea);
    fragment.appendChild(card);
  });

  const surpriseCard = createPromptCard({
    id: 'surprise-mix',
    title: 'Surprise Mixer',
    description: 'Tap for a random outfit recipe every time.',
    badge: '??',
    colors: ['#c6f5ff', '#ffe8b8'],
    type: 'surprise',
  });

  fragment.appendChild(surpriseCard);
  promptCarousel.appendChild(fragment);
  promptCarousel.dataset.enhanced = 'true';

  promptCarousel.addEventListener('click', (event) => {
    const card = event.target.closest('.prompt-card');
    if (!card) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isPromptCarouselLocked && card !== selectedPromptButton) {
      return;
    }

    let promptValue = card.dataset.promptValue || '';
    if (card.dataset.promptType === 'surprise' || !promptValue) {
      promptValue = applySurpriseToCard(card);
    }

    updateSelectedPrompt(card, promptValue, { focus: false });

    if (!items.length) {
      autoGenerateFromPrompt();
      return;
    }

    if (isPromptCarouselLocked) {
      return;
    }

    lockPromptCarousel();
    autoGenerateFromPrompt();
  });

  promptNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!promptCarousel || isPromptCarouselLocked) {
        return;
      }
      const direction = button.dataset.promptNav === 'prev' ? -1 : 1;
      const amount = promptCarousel.clientWidth ? promptCarousel.clientWidth * 0.8 : 240;
      promptCarousel.scrollBy({ left: amount * direction, behavior: 'smooth' });
    });
  });
};

const clearSelectedPromptIfChanged = () => {
  if (!promptInput || !selectedPromptButton) {
    return;
  }

  const currentValue = promptInput.value.trim();
  const selectedValue = (selectedPromptButton.dataset.promptValue || '').trim();
  if (!currentValue || currentValue !== selectedValue) {
    unlockPromptCarousel();
    selectedPromptButton.classList.remove('is-selected');
    selectedPromptButton.setAttribute('aria-pressed', 'false');
    selectedPromptButton = null;
  }
};


const redirectToLogin = () => {
  window.location.replace('./login.html');
};

const ensureAuthenticated = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/session`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    await response.json();
  } catch (error) {
    console.error('Session check failed', error);
    redirectToLogin();
  }
};
const createId = () => Math.random().toString(36).slice(2, 9);

const revokePreviews = () => {
  items.forEach((item) => {
    if (item.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(item.preview);
    }
  });
};

const renderPreviews = () => {
  previews.innerHTML = '';

  if (!items.length) {
    previews.innerHTML = '<p class="status-message">No pictures yet. Add a smiling photo to kick off the fashion fun!</p>';
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.innerHTML = `
      <img src="${item.preview}" alt="Preview ${index + 1}" />
      <footer>
        <span>#${index + 1}</span>
        <button type="button" data-id="${item.id}">Remove</button>
      </footer>
    `;
    previews.appendChild(card);
  });
};

const sanitizeFileName = (value = '') => value.replace(/[\\/:*?"<>|]/g, '_');

const ensureDownloadName = (fileName, index) => {
  const fallback = `pixsnap-look-${index + 1}.png`;
  if (!fileName) {
    return fallback;
  }
  const trimmed = fileName.trim();
  if (!trimmed) {
    return fallback;
  }
  const sanitized = sanitizeFileName(trimmed);
  const lower = sanitized.toLowerCase();
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
    return sanitized;
  }
  return `${sanitized}.png`;
};

const createResultCard = (image, index) => {
  if (!image?.dataUrl) {
    return null;
  }

  const displayName = (image.fileName || '').trim() || `Look ${index + 1}`;
  const downloadName = ensureDownloadName(image.fileName, index);
  const figure = document.createElement('figure');
  figure.className = 'result-card';
  figure.dataset.state = 'wrapped';

  const img = document.createElement('img');
  img.src = image.dataUrl;
  img.alt = displayName;
  img.loading = 'lazy';
  img.setAttribute('aria-hidden', 'true');
  figure.appendChild(img);

  const caption = document.createElement('figcaption');
  caption.className = 'result-caption';
  caption.setAttribute('aria-hidden', 'true');

  const captionText = document.createElement('span');
  captionText.className = 'result-caption__text';
  captionText.textContent = displayName;

  const saveButton = document.createElement('a');
  saveButton.className = 'result-save';
  saveButton.href = image.dataUrl;
  saveButton.download = downloadName;
  saveButton.textContent = 'Save';
  saveButton.setAttribute('tabindex', '-1');

  caption.appendChild(captionText);
  caption.appendChild(saveButton);
  figure.appendChild(caption);

  const cover = document.createElement('button');
  cover.type = 'button';
  cover.className = 'present-cover';
  cover.setAttribute('aria-label', `Reveal ${displayName}`);
  cover.innerHTML = `
    <span class="present-cover__bow" aria-hidden="true"></span>
    <span class="present-cover__ribbon present-cover__ribbon--vertical" aria-hidden="true"></span>
    <span class="present-cover__ribbon present-cover__ribbon--horizontal" aria-hidden="true"></span>
    <span class="present-cover__text">Tap to unwrap</span>
  `;

  figure.appendChild(cover);
  return figure;
};

const handleResultReveal = (cover) => {
  if (!cover) {
    return false;
  }

  const figure = cover.closest('.result-card');
  if (!figure || figure.dataset.state === 'revealed') {
    return false;
  }

  figure.dataset.state = 'revealed';

  const img = figure.querySelector('img');
  const caption = figure.querySelector('figcaption');
  const saveButton = figure.querySelector('.result-save');

  if (img) {
    img.removeAttribute('aria-hidden');
  }

  if (caption) {
    caption.removeAttribute('aria-hidden');
  }

  if (saveButton) {
    saveButton.removeAttribute('tabindex');
    saveButton.focus({ preventScroll: true });
  }

  cover.classList.add('present-cover--hidden');
  cover.setAttribute('aria-hidden', 'true');
  cover.disabled = true;

  window.setTimeout(() => {
    cover.remove();
  }, 320);

  return true;
};

const triggerDownload = (anchor) => {
  const link = document.createElement('a');
  link.href = anchor.href;
  link.download = anchor.download || 'pixsnap-look.png';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  window.requestAnimationFrame(() => {
    document.body.removeChild(link);
  });
};

const attemptShareFromAnchor = async (anchor) => {
  if (!navigator.share || !window.File || !window.Blob) {
    return 'unsupported';
  }

  const href = anchor.getAttribute('href');
  if (!href) {
    return 'unsupported';
  }

  try {
    const response = await fetch(href);
    const blob = await response.blob();
    const fileName = anchor.getAttribute('download') || 'pixsnap-look.png';
    const file = new File([blob], fileName, { type: blob.type || 'image/png' });
    const shareData = {
      files: [file],
      title: fileName,
      text: 'Check out my Pixsnap look!',
    };

    if (navigator.canShare && !navigator.canShare(shareData)) {
      return 'unsupported';
    }

    await navigator.share(shareData);
    return 'shared';
  } catch (error) {
    if (error?.name === 'AbortError') {
      return 'aborted';
    }

    console.warn('Native share failed', error);
    return 'failed';
  }
};

const handleResultImagesClick = async (event) => {
  const cover = event.target.closest('.present-cover');
  if (cover && handleResultReveal(cover)) {
    return;
  }

  const saveAnchor = event.target.closest('.result-save');
  if (!saveAnchor) {
    return;
  }

  if (!navigator.share) {
    return;
  }

  event.preventDefault();
  const outcome = await attemptShareFromAnchor(saveAnchor);

  if (outcome === 'unsupported' || outcome === 'failed') {
    triggerDownload(saveAnchor);
  }
};
const addFiles = (fileList) => {
  const accepted = Array.from(fileList).filter((file) => file?.type?.startsWith('image/'));
  const availableSlots = MAX_FILES - items.length;

  if (!accepted.length) {
    alert('We can only use picture files like PNG, JPG, or WebP.');
    return;
  }

  if (!availableSlots) {
    alert(`You can add up to ${MAX_FILES} pictures. Try removing one to add another.`);
    return;
  }

  accepted.slice(0, availableSlots).forEach((file) => {
    const id = createId();
    const preview = URL.createObjectURL(file);
    items.push({ id, file, preview });
  });

  renderPreviews();
};

const handleDrop = (event) => {
  event.preventDefault();
  dropZone.classList.remove('active');
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files);
  }
};

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
dropZone.addEventListener('drop', handleDrop);

browseBtn?.addEventListener('click', () => fileInput?.click());
fileInput?.addEventListener('change', (event) => {
  addFiles(event.target.files);
  fileInput.value = '';
});

document.addEventListener('paste', (event) => {
  const pasteFiles = Array.from(event.clipboardData?.items || [])
    .filter((item) => item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter(Boolean);

  if (pasteFiles.length) {
    addFiles(pasteFiles);
  }
});

previews.addEventListener('click', (event) => {
  if (event.target.matches('button[data-id]')) {
    const { id } = event.target.dataset;
    const target = items.find((item) => item.id === id);
    if (target?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(target.preview);
    }
    items = items.filter((item) => item.id !== id);
    renderPreviews();
  }
});

resultImages?.addEventListener('click', handleResultImagesClick);

const setGeneratingState = (generating) => {
  isGenerating = generating;
  generateBtn.disabled = generating;
  if (generating) {
    generateBtn.innerHTML = '<span class="loading">Making magic...</span>';
    if (generationAudio) {
      try {
        generationAudio.currentTime = 0;
        const playPromise = generationAudio.play();
        if (playPromise?.catch) {
          playPromise.catch((error) => {
            console.warn('Unable to play generation audio', error);
          });
        }
      } catch (error) {
        console.warn('Unable to play generation audio', error);
      }
    }
  } else {
    generateBtn.textContent = 'Make Magic!';
    if (generationAudio) {
      generationAudio.pause();
      generationAudio.currentTime = 0;
    }
  }

  if (!generating && pendingPromptAutoRun) {
    pendingPromptAutoRun = false;
    window.requestAnimationFrame(() => {
      autoGenerateFromPrompt();
    });
  }
};

const resetResults = (message = '') => {
  resultText.innerHTML = message ? `<p class="status-message">${message}</p>` : '';
  resultImages.innerHTML = '';
};

const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
};

const closeCameraModal = () => {
  cameraModal.hidden = true;
  cameraModal.setAttribute('aria-hidden', 'true');
  stopCamera();
};

const openCameraModal = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert('Looks like the camera is not supported in this browser.');
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
    });
    cameraVideo.srcObject = cameraStream;
    cameraModal.hidden = false;
    cameraModal.setAttribute('aria-hidden', 'false');
    cameraVideo.focus({ preventScroll: true });
  } catch (error) {
    alert('We could not reach the camera. Please check permissions and try again.');
    console.error('Camera error', error);
    closeCameraModal();
  }
};

const capturePhoto = () => {
  if (!cameraStream) return;

  const trackSettings = cameraStream.getVideoTracks()[0]?.getSettings();
  const width = trackSettings?.width || 720;
  const height = trackSettings?.height || 720;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(cameraVideo, 0, 0, width, height);

  canvas.toBlob((blob) => {
    if (!blob) {
      alert('We could not capture that photo. Let us try again!');
      return;
    }

    const file = new File([blob], `camera-${Date.now()}.png`, { type: 'image/png' });
    addFiles([file]);
    closeCameraModal();
  }, 'image/png');
};

cameraBtn?.addEventListener('click', openCameraModal);
cameraCancelBtn?.addEventListener('click', closeCameraModal);
cameraCloseBtn?.addEventListener('click', closeCameraModal);
cameraCaptureBtn?.addEventListener('click', capturePhoto);

cameraModal.addEventListener('click', (event) => {
  if (event.target === cameraModal) {
    closeCameraModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !cameraModal.hidden) {
    closeCameraModal();
  }
});

logoutBtn?.addEventListener('click', async () => {
  try {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
});
  } catch (error) {
    console.error('Failed to log out', error);
  } finally {
    redirectToLogin();
  }
});

const generate = async () => {
  if (!items.length) {
    alert(NO_IMAGE_ALERT);
    return;
  }

  setGeneratingState(true);
  resetResults('Sprinkling pixie dust... waiting for Gemini to reply!');

  try {
    const formData = new FormData();
    items.forEach((item) => formData.append('images', item.file));
    formData.append('prompt', promptInput.value);

    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (response.status === 401) {
      redirectToLogin();
      return;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed request.' }));
      throw new Error(error.error || 'Unexpected server error.');
    }

    const payload = await response.json();

    resultText.innerHTML = '';
    if (payload.texts?.length) {
      payload.texts.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        resultText.appendChild(paragraph);
      });
    }

    resultImages.innerHTML = '';
    if (payload.images?.length) {
      payload.images.forEach((image, index) => {
        const card = createResultCard(image, index);
        if (card) {
          resultImages.appendChild(card);
        }
      });
    }

    if (!payload.images?.length && !payload.texts?.length) {
      resetResults('No story or pictures came back this time. Try tweaking your prompt or swapping the pictures.');
    }
  } catch (error) {
    console.error(error);
    resetResults(error.message || 'The magic fizzled out. Please try again.');
  } finally {
    setGeneratingState(false);
  }
};

setupPromptCarousel();
if (promptInput) {
  promptInput.addEventListener('input', clearSelectedPromptIfChanged);
}

generateBtn.addEventListener('click', generate);
window.addEventListener('beforeunload', revokePreviews);
ensureAuthenticated();
renderPreviews();


