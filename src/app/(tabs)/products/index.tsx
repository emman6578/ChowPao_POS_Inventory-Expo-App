import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";

import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";

import ProductListItem from "@/src/components/ProductListItem";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function TabOneScreen() {
  const { ProductList } = useProtectedRoutesApi();

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: ProductList,
  });

  const products = data?.data;

  return (
    <FlatList
      data={products}
      renderItem={({ item }: any) => <ProductListItem item={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
