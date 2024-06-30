import { API_URL } from "@/libraries/API/config/config";

export const login = async (data: { email: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    throw new Error("Error logging in");
  }
};

export const authenticate = async (data: {
  email: string;
  emailToken: string;
}) => {
  const res = await fetch(`${API_URL}/auth/authenticate`, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status !== 200) {
    throw new Error("Error logging in");
  }

  return await res.json();
};
