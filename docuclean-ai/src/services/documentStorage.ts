export interface UserDocumentItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  date: string;
  timestamp: number;
  status: 'Cleaned' | 'Restored';
}

const getStorageKey = (email: string) => `docuclean_documents_${email.trim().toLowerCase()}`;

export const getUserDocuments = (email: string): UserDocumentItem[] => {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (raw) {
      return JSON.parse(raw) as UserDocumentItem[];
    }
  } catch {
    // ignore
  }
  return [];
};

export const saveUserDocument = (
  email: string,
  doc: Omit<UserDocumentItem, 'id' | 'timestamp'>
): UserDocumentItem => {
  const existing = getUserDocuments(email);
  const newDoc: UserDocumentItem = {
    ...doc,
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };

  const updated = [newDoc, ...existing];
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newDoc;
};

export const deleteUserDocument = (email: string, id: string): UserDocumentItem[] => {
  const existing = getUserDocuments(email);
  const updated = existing.filter((d) => d.id !== id);
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
};
