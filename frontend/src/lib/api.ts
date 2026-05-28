const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const api = {
  async get(endpoint: string) {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `GET ${endpoint} failed`,
      );
    }

    return response.json();
  },

  async post(
    endpoint: string,
    body: unknown,
  ) {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(
        `POST ${endpoint} failed`,
      );
    }

    return response.json();
  },

  async patch(
    endpoint: string,
    body: unknown,
  ) {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(
        `PATCH ${endpoint} failed`,
      );
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `DELETE ${endpoint} failed`,
      );
    }

    return true;
  },
};