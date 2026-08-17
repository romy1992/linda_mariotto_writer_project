import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { SiteSettings } from "../types";

const SETTINGS_DOC = doc(db, "settings", "site");

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snapshot = await getDoc(SETTINGS_DOC);
  return snapshot.exists() ? (snapshot.data() as SiteSettings) : null;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>,
): Promise<void> {
  await setDoc(
    SETTINGS_DOC,
    { ...settings, updatedAt: Date.now() },
    { merge: true },
  );
}
