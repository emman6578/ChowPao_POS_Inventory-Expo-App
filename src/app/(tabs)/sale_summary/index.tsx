import React from "react";
import { View, Text } from "@/src/components/Themed";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

const SalesReport = () => {
  const { SalesReport } = useProtectedRoutesApi();

  // Fetch sales report data
  const { data: salesData, isLoading } = useQuery({
    queryKey: ["salesReport"],
    queryFn: SalesReport,
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sales Summary" }} />
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={salesData?.data || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                router.push({
                  pathname: "sale_summary/productSold",
                  params: { id: item.id },
                });
              }}
            >
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>

              <Text>Driver Name: {item.driver?.fullname}</Text>
              <Text>Email: {item.driver?.email}</Text>
              <Text>Total in Retail: &#8369;{item.total_in_retail}</Text>
              <Text>Total in Wholesale: &#8369;{item.total_in_wholesale}</Text>
              <Text>Balance: &#8369;{item.balance}</Text>
              <Text>Quantity Sold: {item.quantity} </Text>
              <Text>Remaining Products: {item.remainingProducts} </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingText: {
    fontSize: 18,
    alignSelf: "center",
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  date: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  innerList: {
    marginTop: 10,
  },
  productContainer: {
    marginLeft: 10,
    marginTop: 10,
  },
  productName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default SalesReport;
