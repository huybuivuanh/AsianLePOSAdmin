import {
  getApps,
  initializeApp,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function initAdminApp(): App {
  if (app) return app;

  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }

  const raw = process.env.ADMIN_SERVICE_ACCOUNT_KEY;
  if (!raw?.trim()) {
    throw new Error(
      "Missing ADMIN_SERVICE_ACCOUNT_KEY. Set it in .env.local to a JSON string of your Firebase service account (single line, or use a file path pattern if you prefer)."
    );
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(raw) as ServiceAccount;
  } catch {
    throw new Error(
      "ADMIN_SERVICE_ACCOUNT_KEY must be valid JSON (your Firebase service account key)."
    );
  }

  app = initializeApp({
    credential: cert(serviceAccount),
  });

  return app;
}

/** Call inside API routes; throws a clear error if env is not configured. */
export function getAdminAuth(): Auth {
  initAdminApp();
  return getAuth();
}

/** Call inside API routes; throws a clear error if env is not configured. */
export function getAdminDb(): Firestore {
  initAdminApp();
  return getFirestore();
}
