const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function getProfile() {
  const token =
    localStorage.getItem('token');

  const response = await fetch(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unauthorized',
    );
  }

  return response.json();
}