import { API_URL } from "@/libraries/API/config/config";

export const login = async (data: { email: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Check if response is not OK (status code not in range 200-299)
    let errorMessage = "Failed log in";
    const responseBody = await res.json(); // Attempt to parse response body as JSON

    // Check if response body has an error message from the backend
    if (responseBody && responseBody.message) {
      errorMessage = responseBody.message;
    }

    throw new Error(errorMessage);
  }
};

export const authenticate = async (data: {
  email: string;
  emailToken: string;
}) => {
  const res = await fetch(`${API_URL}/auth/authenticate`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Check if response is not OK (status code not in range 200-299)
    let errorMessage = "Failed log in";
    const responseBody = await res.json(); // Attempt to parse response body as JSON

    // Check if response body has an error message from the backend
    if (responseBody && responseBody.message) {
      errorMessage = responseBody.message;
    }

    throw new Error(errorMessage);
  }

  return await res.json();
};
