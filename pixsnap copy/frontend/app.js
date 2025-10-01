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

const MAX_FILES = 6;
let items = [];
let cameraStream = null;

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

const setGeneratingState = (generating) => {
  generateBtn.disabled = generating;
  if (generating) {
    generateBtn.innerHTML = '<span class="loading">Making magic...</span>';
  } else {
    generateBtn.textContent = 'Make Magic!';
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
    alert('Add at least one picture. Start with a photo of you so the magic knows who to dress up.');
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
      payload.images.forEach((image) => {
        const container = document.createElement('figure');
        const img = document.createElement('img');
        img.src = image.dataUrl;
        img.alt = image.fileName;
        const caption = document.createElement('figcaption');
        caption.textContent = image.fileName;
        container.appendChild(img);
        container.appendChild(caption);
        resultImages.appendChild(container);
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

generateBtn.addEventListener('click', generate);
window.addEventListener('beforeunload', revokePreviews);
ensureAuthenticated();
renderPreviews();





