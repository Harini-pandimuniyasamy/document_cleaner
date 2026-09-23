// Determine reliable API base endpoint for full-stack architecture
const resolveApiBase = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim();
    // Prevent invalid localhost bindings when running in preview/production containers
    if (trimmed.includes('localhost:5000')) {
      return '/api';
    }
    return trimmed.replace(/\/+$/, '');
  }
  return '/api';
};

const API_BASE = resolveApiBase();

const TOKEN_KEY = 'docuclean_auth_token';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
};

const getHeaders = (isMultipart = false): HeadersInit => {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Safely parse HTTP responses and gracefully handle HTML/non-JSON error pages
 */
async function handleResponse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data = await res.json();
      return data;
    } catch {
      // json parse failed
    }
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Server returned status ${res.status}: ${res.statusText || 'Unable to process request'}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Server returned an unexpected response format.');
  }
}

// =========================================================================
// Auth API
// =========================================================================
export const authApi = {
  async register(fullName: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ fullName, email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        setAuthToken(null);
        return null;
      }
      return handleResponse(res);
    } catch {
      return null;
    }
  },
};

// =========================================================================
// Documents API
// =========================================================================
export const documentsApi = {
  async upload(file: File, options: string[] = ['remove-spaces', 'fix-line-breaks', 'correct-ocr']) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('options', JSON.stringify(options));

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  async submitText(
    text: string,
    title?: string,
    options: string[] = ['remove-spaces', 'fix-line-breaks', 'correct-ocr']
  ) {
    const res = await fetch(`${API_BASE}/documents/text`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, title, options }),
    });
    return handleResponse(res);
  },

  async getMyDocuments() {
    const res = await fetch(`${API_BASE}/documents/my-documents`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getById(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async download(id: string, fileName?: string, format?: string) {
    return this.downloadCleaned(id, fileName, format);
  },

  async downloadCleaned(id: string, fileName?: string, format?: string) {
    const token = getAuthToken();
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (format) params.set('format', format);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const url = `${API_BASE}/documents/${id}/download-cleaned${queryString}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });

    if (!res.ok) {
      let errMsg = `Download failed (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.message) errMsg = errJson.message;
      } catch {
        // ignore
      }
      throw new Error(errMsg);
    }

    const blob = await res.blob();
    if (blob.size === 0) {
      throw new Error('Downloaded document is empty (0 bytes).');
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'cleaned_document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);

    return true;
  },

  async downloadOriginal(id: string, fileName?: string) {
    const token = getAuthToken();
    const url = `${API_BASE}/documents/${id}/download-original${token ? `?token=${encodeURIComponent(token)}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });

    if (!res.ok) {
      let errMsg = `Original download failed (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.message) errMsg = errJson.message;
      } catch {
        // ignore
      }
      throw new Error(errMsg);
    }

    const blob = await res.blob();
    if (blob.size === 0) {
      throw new Error('Original document is empty (0 bytes).');
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'original_document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);

    return true;
  },

  async view(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}/view?format=json`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async delete(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
