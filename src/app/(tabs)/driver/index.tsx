import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text, View } from "@/src/components/Themed";

import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

// DRIVER HOME SCREEN

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 20) / 2; // Adjusted for proper width and spacing

export default function TabOneScreen() {
  const { GetDriverLoggedIn, GetDeliveryLoad, GetDeliveryProducts } =
    useProtectedRoutesApi();

  const router = useRouter();

  const driverDetails = useQuery({
    queryKey: ["driver"],
    queryFn: GetDriverLoggedIn,
  });

  const driver = driverDetails.data?.data;

  const driverLoad = useQuery({
    queryKey: ["deliveryLoad"],
    queryFn: GetDeliveryLoad,
  });

  const load = driverLoad.data?.data;

  const loadProducts = useQuery({
    queryKey: ["deliveryProducts"],
    queryFn: GetDeliveryProducts,
  });

  const products = loadProducts.data?.data.DriverLoadProducts;

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prevSelectedProductIds) => {
      if (prevSelectedProductIds.includes(productId)) {
        return prevSelectedProductIds.filter((id) => id !== productId);
      } else {
        return [...prevSelectedProductIds, productId];
      }
    });
  };

  const handleConfirm = () => {
    const name = products
      .filter((item: any) => selectedProductIds.includes(item.Product.id))
      .map((item: any) => item.Product.name);

    router.push({
      pathname: "driver/customer",
      params: {
        productId: selectedProductIds,
        productName: name,
      },
    });

    setSelectedProductIds([]);
  };

  const renderProductItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => toggleProductSelection(item.Product.id)}>
      <View
        style={[
          styles.productItem,
          selectedProductIds.includes(item.Product.id) &&
            styles.selectedProductItem,
        ]}
      >
        <Text
          style={[styles.productText, { fontWeight: "900", marginBottom: 5 }]}
        >
          {item.Product.name}
        </Text>
        <Text style={styles.productText}>
          Retail:{" "}
          {
            <Text style={{ color: "coral", fontWeight: "900" }}>
              &#8369;
              {item.Product.price.toFixed(2)}
            </Text>
          }
        </Text>
        <Text style={styles.productText}>
          Wholesale:{" "}
          {
            <Text style={{ color: "teal", fontWeight: "900" }}>
              &#8369;
              {item.Product.wholesale_price.toFixed(2)}
            </Text>
          }
        </Text>
        <Text style={styles.productText}>Quantity: {item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ padding: 10, alignItems: "center" }}>
        <Text style={{ fontWeight: "900", fontSize: 20 }}>
          Welcome {driver?.fullname}
        </Text>
        <Text style={{ fontWeight: "900", fontSize: 15 }}>
          Delivery Load For Today!
        </Text>
      </View>
      <View style={styles.headerCard}>
        <Text style={styles.headerText}>
          Total Products: {`\t`}
          {<Text style={{ color: "white" }}>{load?.total_load_products}</Text>}
        </Text>

        <Text style={styles.headerText}>
          Expected Sales in Retail:
          {
            <Text style={{ color: "white" }}>
              {`\t`} &#8369; {load?.expected_sales}
            </Text>
          }
        </Text>
        <Text style={styles.headerText}>
          Expected Sales in Wholesale:
          {
            <Text style={{ color: "white" }}>
              {`\t`}&#8369; {load?.expected_sales_wholesale}
            </Text>
          }
        </Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.Product.id}
        numColumns={2}
        style={styles.productList}
      />

      <TouchableOpacity
        disabled={selectedProductIds.length === 0}
        style={[
          styles.confirmButton,
          selectedProductIds.length === 0 && styles.disabledConfirmButton,
        ]}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: "teal",
    padding: 20,
    borderRadius: 20,
  },
  headerComponent: {
    backgroundColor: "teal",
    borderRadius: 20,
    padding: 10,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "900",
    color: "lightgray",
    alignSelf: "center",
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    width: itemWidth,
  },
  selectedProductItem: {
    backgroundColor: "#f9f4d9",
  },
  productText: {
    fontSize: 15,

    color: "black",
  },
  confirmButton: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: "coral",
    alignItems: "center",
  },
  disabledConfirmButton: {
    backgroundColor: "grey",
  },
  confirmButtonText: {
    color: "black",
    fontWeight: "900",
  },
});
