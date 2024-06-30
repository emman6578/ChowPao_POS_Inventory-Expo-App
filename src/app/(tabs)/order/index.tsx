import React from "react";
import { StyleSheet, FlatList, ScrollView } from "react-native";

import { Text, View } from "@/src/components/Themed";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";

export default function TabTwoScreen() {
  const { GetOrders } = useProtectedRoutesApi();

  const { data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: GetOrders,
  });

  const orders = data?.data;

  const renderOrderItem = ({ item }: any) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Address: {item.address}</Text>
      <Text style={styles.orderText}>Admin: {item.admin?.fullname}</Text>

      <ScrollView>
        {item.Product.map((product: any) => (
          <View
            key={product.id}
            style={{
              marginLeft: 10,
              backgroundColor: "lightblue",
              padding: 5,
              borderRadius: 5,
              marginVertical: 10,
            }}
          >
            <Text style={styles.orderText}>{product.Product.name}</Text>
            <Text style={styles.orderText}> Quantity: {product.quantity}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  orderItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  orderText: {
    fontWeight: "900",
    color: "black",
    fontSize: 16,
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});
