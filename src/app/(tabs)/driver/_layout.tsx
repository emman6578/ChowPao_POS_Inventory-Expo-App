import React from "react";
import { Link, Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { deleteToken } from "@/libraries/Secure Store/expoSecureStore";
import { useAuth } from "@/src/Context/AuthContext";
import { Text, View } from "@/src/components/Themed";
import { useQuery } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";

const ProductLayout = () => {
  const router = useRouter();
  const { updateAuthToken } = useAuth();

  const logout = async () => {
    await deleteToken();
    await updateAuthToken(null);
    router.replace("/login");
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <>
              {/* <Link href={"/cart"} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View>
                      <AntDesign
                        name="shoppingcart"
                        size={25}
                        color="orange"
                        style={{ marginRight: 30, opacity: pressed ? 0.5 : 1 }}
                      />
                    </View>
                  )}
                </Pressable>
              </Link> */}

              <Pressable onPress={logout}>
                {({ pressed }) => (
                  <View
                    style={{
                      marginRight: 10,
                      opacity: pressed ? 0.5 : 1,
                      backgroundColor: "red",
                      padding: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Logout
                    </Text>
                  </View>
                )}
              </Pressable>
            </>
          ),
        }}
      />
      <Stack.Screen
        name="customer"
        options={{
          title: "Select Customer",
        }}
      />
    </Stack>
  );
};

export default ProductLayout;
