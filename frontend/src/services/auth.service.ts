const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async register(data: {
    email: string;
    password: string;
    role: "TEACHER" | "ADMIN";
  }) {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      },
    );

    const responseData =
      await response.json();

    if (!response.ok) {
      console.log(
  "FULL ERROR:",
  JSON.stringify(responseData, null, 2),
);

    throw new Error(
  responseData.error?.message ||
  responseData.message ||
  "Registration failed",
);
    }

    return responseData;
  },

  async login(data: {
    email: string;
    password: string;
  }) {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      },
    );

    const responseData =
      await response.json();

    if (!response.ok) {
     console.log(
  "FULL ERROR:",
  JSON.stringify(responseData, null, 2),
);

      throw new Error(
  responseData.error?.message ||
  responseData.message ||
  "Registration failed",
);
    }

    return responseData;
  },
};