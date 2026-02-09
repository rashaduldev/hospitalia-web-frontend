export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const error: any = new Error(data.message || "Something went wrong");
    error.status = res.status;
    error.errors = data.payload || null;
    throw error;
  }

  return data;
}