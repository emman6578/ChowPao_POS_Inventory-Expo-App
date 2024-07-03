import React from "react";
import { View, Text } from "@/src/components/Themed";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

const ProductSold = () => {
  const { id } = useLocalSearchParams();

  const { SalesReport } = useProtectedRoutesApi();

  // Fetch sales report data
  const { data: salesData, isLoading } = useQuery({
    queryKey: ["salesReport"],
    queryFn: SalesReport,
  });

  const report = salesData?.data;

  // Find the sales report object with matching id
  const salesReport = report?.find((item: any) => item.id === id);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sales Summary" }} />

      {salesReport && (
        <FlatList
          data={salesReport.products}
          keyExtractor={(item, index) => `${item.Product.name}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Text style={styles.productName}>{item.Product.name}</Text>
              <Text style={styles.productPrice}>
                Sales: &#8369;{item.sales.toFixed(2)}
              </Text>
              <Text style={styles.productPrice}>
                Balance: &#8369;{item.balance.toFixed(2)}
              </Text>
              <Text style={[styles.productQuantity, { color: "yellow" }]}>
                Quantity: {item.quantity}
              </Text>
              <Text style={styles.productQuantity}>
                Sale Type: {item.saleType}
              </Text>
              <Text style={styles.productQuantity}>
                Payment Options: {item.paymentOptions}
              </Text>
              <Text style={styles.productQuantity}>
                Payment Status: {item.paymentStatus}
              </Text>
              <Text style={styles.productQuantity}>
                Customer: {item.Customer?.name}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={{ alignItems: "center", padding: 10, backgroundColor: "red" }}
      >
        <Text>Print Daily Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  productContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "green",
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
  },
});

export default ProductSold;
