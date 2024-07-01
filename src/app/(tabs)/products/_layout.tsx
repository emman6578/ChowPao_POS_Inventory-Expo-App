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

  const { GetCart } = useProtectedRoutesApi();

  const logout = async () => {
    await deleteToken();
    await updateAuthToken(null);
    router.replace("/login");
  };

  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: GetCart,
  });

  const cartCount = data?.data;
  const cartLenght = cartCount?.ProductInCart;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <>
              <Link href={"/cart"} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View>
                      <AntDesign
                        name="shoppingcart"
                        size={25}
                        color="orange"
                        style={{ marginRight: 30, opacity: pressed ? 0.5 : 1 }}
                      />
                      <Text
                        style={{
                          position: "absolute",
                          marginLeft: 25,
                          backgroundColor: "red",
                          borderRadius: 10,
                          padding: 2,
                          fontWeight: "bold",
                          fontSize: 10,
                        }}
                      >
                        {cartLenght?.length}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </Link>

              <Link href={"ProductToExcel"} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign
                      name="addfile"
                      size={25}
                      color="green"
                      style={{ marginRight: 30, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>

              <Link href={"/print/saveToExcelFile"} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign
                      name="download"
                      size={25}
                      color="lightblue"
                      style={{ marginRight: 30, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>

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

      {/* stack screen add below here */}
    </Stack>
  );
};

export default ProductLayout;
