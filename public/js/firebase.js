import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getAnalytics, logEvent as firebaseLogEvent } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js';
import { currentLang } from './ui.js';

export let auth = null;
export let analyticsInstance = null;

export async function initFirebase() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    if (!data.firebase.apiKey) return;

    const f = data.firebase;
    if (!f.authDomain || !f.projectId) {
      console.warn('Firebase: set FIREBASE_AUTH_DOMAIN and FIREBASE_PROJECT_ID in server .env');
      return;
    }

    const firebaseApp = initializeApp(f);
    auth = getAuth(firebaseApp);

    if (data.features.analytics && f.measurementId) {
      analyticsInstance = getAnalytics(firebaseApp);
    }

    onAuthStateChanged(auth, user => {
      const btn = document.getElementById('auth-btn');
      if (!btn) return;
      if (user) {
        btn.textContent = 'Hi, ' + user.displayName.split(' ')[0] + ' ✓';
        btn.style.background = 'rgba(19,136,8,0.15)';
        btn.style.borderColor = '#138808';
        btn.style.color = '#4CAF50';
      } else {
        btn.textContent = currentLang === 'hi' ? 'Google से साइन इन करें' : 'Sign in with Google';
        btn.style.background = 'var(--saffron-lt)';
        btn.style.borderColor = 'var(--saffron)';
        btn.style.color = 'var(--saffron)';
      }
    });

    getRedirectResult(auth).catch(e => {
      if (e.code !== 'auth/no-auth-event') {
        console.error('Redirect result:', e.code, e.message);
      }
    });

  } catch (e) { console.warn('Firebase init:', e.message); }
}

export function handleAuth() {
  if (!auth) {
    const btn = document.getElementById('auth-btn');
    if (!btn) return;
    btn.textContent = 'Sign-in unavailable';
    setTimeout(() => {
      btn.textContent = currentLang === 'hi' ? 'Google से साइन इन करें' : 'Sign in with Google';
    }, 2000);
    return;
  }
  if (auth.currentUser) {
    signOut(auth);
  } else {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch(e => {
      console.error('Auth redirect error:', e.code, e.message);
    });
  }
}

export function logEvent(eventName, eventParams) {
  if (analyticsInstance) {
    firebaseLogEvent(analyticsInstance, eventName, eventParams);
  }
}
