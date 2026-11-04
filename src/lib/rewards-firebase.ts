// Second Firebase connection: the Asian Le Rewards (loyalty) project.
// Each browser signs in once as the shared POS account (Dashboard page); the
// login is remembered. The password is never stored in .env.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFunctions, type Functions } from "firebase/functions";

const REWARDS_APP_NAME = "rewards";

// Public client config, like the main one. Optional: if it's missing the admin
// still works, and the Rewards card says rewards isn't set up.
const rewardsConfig = {
  apiKey: process.env.NEXT_PUBLIC_REWARDS_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REWARDS_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_REWARDS_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_REWARDS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_REWARDS_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_REWARDS_FIREBASE_APP_ID,
};

export const rewardsConfigured = Boolean(
  rewardsConfig.apiKey && rewardsConfig.projectId && rewardsConfig.appId,
);

let rewardsAuth: Auth | null = null;
let rewardsFunctions: Functions | null = null;

if (rewardsConfigured) {
  const rewardsApp = getApps().some((a) => a.name === REWARDS_APP_NAME)
    ? getApp(REWARDS_APP_NAME)
    : initializeApp(rewardsConfig, REWARDS_APP_NAME);
  // Auth persistence is keyed by app name, so this login is stored separately
  // from the admin login.
  rewardsAuth = getAuth(rewardsApp);
  rewardsFunctions = getFunctions(rewardsApp);
}

export { rewardsAuth, rewardsFunctions };
