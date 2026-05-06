export async function adminJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw new Error('Unauthorized');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.');
  }

  return data as T;
}

export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  return adminJson<{
    ok: boolean;
    image: {
      path: string;
      public_url: string;
    };
  }>('/api/admin/uploads/image', {
    method: 'POST',
    body: formData,
  });
}