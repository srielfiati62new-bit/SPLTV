import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
// Store OAuth access token strictly in memory (never in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      cachedUser = user;
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure?.();
      }
    } else {
      cachedUser = null;
      cachedAccessToken = null;
      onAuthFailure?.();
    }
  });
};

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId || '';

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Token akses Google Sheets tidak ditemukan. Pastikan izin spreadsheet diberikan.');
    }
    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    const msg = err instanceof Error ? err.message : String(err || '');
    if (code === 'auth/unauthorized-domain' || msg.includes('auth/unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      const friendly = new Error(
        `Domain "${host}" belum terdaftar di Authorized Domains Firebase (${FIREBASE_PROJECT_ID}). Tambahkan domain ini di Firebase Console → Authentication → Settings → Authorized domains, lalu coba Sign in with Google kembali.`
      ) as Error & { code?: string; unauthorizedHost?: string };
      friendly.code = 'auth/unauthorized-domain';
      friendly.unauthorizedHost = host;
      throw friendly;
    }
    if (code === 'auth/popup-closed-by-user') {
      throw new Error('Jendela login Google ditutup sebelum proses selesai. Silakan coba lagi.');
    }
    if (code === 'auth/popup-blocked') {
      throw new Error('Popup login Google diblokir oleh browser. Izinkan popup untuk situs ini lalu coba lagi.');
    }
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => cachedAccessToken;

export const getCurrentGoogleUser = (): User | null => cachedUser;

export const googleLogout = async (): Promise<void> => {
  await auth.signOut();
  cachedAccessToken = null;
  cachedUser = null;
};
