import { API_BASE_URL } from './config.js';
const form = document.getElementById('login-form');
const redirectToApp = () => {
  window.location.replace('./index.html');
};

const ensureLoggedOut = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/session`, {
      credentials: 'include',
    });

    if (response.ok) {
      redirectToApp();
    }
  } catch (error) {
    console.debug('Session check skipped', error);
  }
};

ensureLoggedOut();
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');
const errorBox = document.getElementById('login-error');
const submitBtn = document.getElementById('login-submit');

const setLoading = (loading) => {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Signing in...' : 'Sign in';
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(true);
  errorBox.textContent = '';

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Unable to sign in.' }));
      throw new Error(payload.error || 'Unable to sign in.');
    }

    redirectToApp();
  } catch (error) {
    console.error(error);
    errorBox.textContent = error.message || 'Invalid credentials.';
  } finally {
    setLoading(false);
  }
});

