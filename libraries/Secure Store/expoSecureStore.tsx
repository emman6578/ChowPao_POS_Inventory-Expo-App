import * as SecureStore from "expo-secure-store";

export const save = async (value: string) => {
  await SecureStore.setItemAsync("authToken", value);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("authToken");
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync("authToken");
};
