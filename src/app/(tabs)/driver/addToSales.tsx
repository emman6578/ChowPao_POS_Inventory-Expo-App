import React, { useState } from "react";
import {
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "@/src/components/Themed";

const AddToSales = () => {
  const { GetDeliveryProducts, GetCustomers, AddToSales } =
    useProtectedRoutesApi();

  const queryClient = useQueryClient();

  // Fetch delivery products and customers
  const loadProducts = useQuery({
    queryKey: ["deliveryProducts"],
    queryFn: GetDeliveryProducts,
  });

  const getCustomer = useQuery({
    queryKey: ["customer"],
    queryFn: GetCustomers,
  });

  const products = loadProducts.data?.data.DriverLoadProducts;
  const customers = getCustomer.data?.data;

  const addSales = useMutation({
    mutationFn: AddToSales,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryProducts"] });
      queryClient.invalidateQueries({ queryKey: ["totalSales"] });
      queryClient.invalidateQueries({ queryKey: ["productSold"] });
      Alert.alert("Success", "Happy shopping");
      router.back();
    },
    onError: (err) => {
      Alert.alert("Error", "Sad shopping\n\n" + err);
    },
  });

  // Initialize state for quantities, selected customer, saleType, and paymentOptions
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [saleType, setSaleType] = useState<string>("RETAIL");
  const [paymentOptions, setPaymentOptions] = useState<string>("CASH");

  const handleInputQuantityChange = (id: string, quantity: number) => {
    setQuantities((prevState) => ({
      ...prevState,
      [id]: quantity,
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (id: string, change: number) => {
    setQuantities((prevState) => {
      const newQuantity = (prevState[id] || 0) + change;
      return {
        ...prevState,
        [id]: Math.max(newQuantity, 0), // Ensure quantity does not go below 0
      };
    });
  };

  // Map product IDs to products with dynamically adjusted quantities
  const { productId } = useLocalSearchParams();
  let productIdsArray: string[] = [];

  if (typeof productId === "string") {
    productIdsArray = productId.split(",");
  } else if (Array.isArray(productId)) {
    productIdsArray = productId;
  }

  const productsArray = productIdsArray.map((id) => ({
    product_id: id.trim(),
    quantity: quantities[id] || 0,
  }));

  // Function to get product name from product ID
  const getProductName = (productId: string) => {
    const product = products?.find(
      (prod: any) => prod.Product.id === productId
    );
    return product ? product.Product.name : "Unknown Product";
  };

  // Define requestBody with products array
  const requestBody = {
    products: productsArray.map((prod) => ({
      product_id: prod.product_id,
      quantity: prod.quantity,
    })),
    customerid: selectedCustomer, // Use selected customer ID here
    saleType: saleType, // Use selected saleType here
    paymentOptions: paymentOptions, // Use selected paymentOptions here
  };

  // Function to handle customer selection
  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomer === customerId) {
      setSelectedCustomer(null); // Deselect if already selected
    } else {
      setSelectedCustomer(customerId); // Select the new customer
    }
  };

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Stack.Screen options={{ title: "Confirm Sale" }} />
      <Text style={{ marginBottom: 10, fontWeight: "900" }}>
        Select A customer:
      </Text>
      <View style={{ maxHeight: 150 }}>
        <FlatList
          data={customers} // Pass the customers array to FlatList
          keyExtractor={(item) => item.id} // Assuming id is unique
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginBottom: 10,
                backgroundColor:
                  selectedCustomer === item.id ? "coral" : "teal",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => {
                handleSelectCustomer(item.id);
              }}
            >
              <Text style={{ fontSize: 12 }}>{item.name}</Text>
              <Text style={{ fontSize: 12 }}>{item.address}</Text>
            </TouchableOpacity>
          )}
          numColumns={2} // Set number of columns to 2
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </View>

      <ScrollView contentContainerStyle={{ marginTop: 10 }}>
        {productsArray.map((prod) => (
          <View key={prod.product_id} style={{ marginBottom: 5 }}>
            <Text style={{ marginBottom: 5, fontWeight: "900" }}>
              {getProductName(prod.product_id)}
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 5,
                maxWidth: "50%",
              }}
              keyboardType="numeric"
              placeholder="Enter quantity"
              value={quantities[prod.product_id]?.toString() || ""}
              onChangeText={(text) => {
                const quantity = parseInt(text, 10) || 0;
                handleInputQuantityChange(prod.product_id, quantity);
              }}
            />

            <View
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                top: "40%",
                right: "10%",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "lightgray",
                    borderRadius: 10,
                    marginRight: 5,
                  }}
                  onPress={() => handleQuantityChange(prod.product_id, 1)}
                >
                  <Text
                    style={{
                      marginHorizontal: 20,
                      fontSize: 20,
                      fontWeight: "900",
                      color: "black",
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: "lightgray", borderRadius: 10 }}
                  onPress={() => handleQuantityChange(prod.product_id, -1)}
                >
                  <Text
                    style={{
                      marginHorizontal: 20,
                      fontSize: 20,
                      fontWeight: "900",
                      color: "black",
                    }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={{ marginVertical: 10 }}>
          {/* List options for saleType */}
          {["RETAIL", "WHOLESALE"].map((type) => (
            <TouchableOpacity
              key={type}
              style={{
                marginRight: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                marginBottom: 5,
                backgroundColor: saleType === type ? "coral" : "teal",
              }}
              onPress={() => setSaleType(type)}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginBottom: 20 }}>
          {/* List options for paymentOptions */}
          {["CASH", "GCASH", "PAY_LATER"].map((option) => (
            <TouchableOpacity
              key={option}
              style={{
                marginRight: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                backgroundColor: paymentOptions === option ? "coral" : "teal",
                marginBottom: 5,
                maxWidth: "75%",
              }}
              onPress={() => setPaymentOptions(option)}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: "blue",
          alignItems: "center",
          borderRadius: 20,
        }}
        onPress={() => {
          addSales.mutate(requestBody);
        }}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddToSales;
