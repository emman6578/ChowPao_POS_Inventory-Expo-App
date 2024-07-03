import React, { useState } from "react";
import { View, Text } from "@/src/components/Themed"; // Assuming Themed components include StyleSheet
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import moment from "moment";

const DriverTotalSales = () => {
  const [refresh, setRefresh] = useState(false);

  const { id, totalLoadProducts } = useLocalSearchParams();
  const { GetDriverSales, GetDeliveries } = useProtectedRoutesApi();

  const deliveryList = useQuery({
    queryKey: ["deliveries"],
    queryFn: GetDeliveries,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["driverSales"],
    queryFn: () => GetDriverSales(id as string),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading data</Text>;

  const { fullname, email } = data?.data.driver || {};
  const {
    totalRetailSales,
    totalWholesaleSales,
    totalUnpaidBalance,
    totalQuantity,
  } = data?.data.totals || {};

  const delivery = deliveryList.data?.data;

  const ProductList = ({ delivery }: any) => {
    return (
      <View style={styles.productList} key={delivery.id}>
        {delivery.DriverLoadProducts.map((product: any) => (
          <View key={product.id} style={styles.productCard}>
            <Text style={styles.productText}>{product.Product?.name}</Text>
            <Text style={styles.productText}>Quantity: {product.quantity}</Text>
            <Text style={styles.productText}>
              Price: &#8369;{product.Product?.price}
            </Text>
            <Text style={styles.productText}>
              Wholesale Price: &#8369;{product.Product?.wholesale_price}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const onRefresh = () => {
    setRefresh(true);
    refetch();
    deliveryList.refetch();
    setRefresh(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Total Sales` }} />
      <Text style={styles.header}>{fullname}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.email}>{moment().format("MMMM Do YYYY")}</Text>

      <View style={styles.totalsContainer}>
        <Text style={styles.totalItem}>
          Total Retail Sales: &#8369;
          {totalRetailSales.toFixed(2)}
        </Text>
        <Text style={styles.totalItem}>
          Total Wholesale Sales: &#8369;
          {totalWholesaleSales.toFixed(2)}
        </Text>
        <Text style={styles.totalItem}>
          Total Unpaid Balance: &#8369;{totalUnpaidBalance.toFixed(2)}
        </Text>
        <Text style={styles.totalItem}>
          Total Quantity Sold: {totalQuantity}
        </Text>
        <Text style={styles.totalItem}>
          Quantity Remaining in Truck: {totalLoadProducts}
        </Text>
      </View>

      <FlatList
        data={delivery}
        renderItem={({ item }: any) => <ProductList delivery={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: "teal",
          marginTop: 5,
          borderRadius: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "900", fontSize: 15, letterSpacing: 3 }}>
          PRINT {"\t"} RECEIPT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 12,
  },
  totalsContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  totalItem: {
    fontSize: 15,
    marginBottom: 5,
  },

  productList: {
    marginTop: 5,
    width: "100%",
  },
  productCard: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  productText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "900",
  },
});

export default DriverTotalSales;
