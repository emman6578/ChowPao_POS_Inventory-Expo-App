import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { View, Text } from "@/src/components/Themed";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";

import React, { useState } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 20) / 2; // Adjusted for proper width and spacing

const Customer = () => {
  const { productId } = useLocalSearchParams();

  const productIds = productId;

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  const { GetCustomers } = useProtectedRoutesApi();
  const router = useRouter();

  const getCustomer = useQuery({
    queryKey: ["customer"],
    queryFn: GetCustomers,
  });

  const customers = getCustomer.data?.data;

  // Function to handle customer selection
  const handleSelectCustomer = (customerId: string, customerName: string) => {
    if (selectedCustomer === customerId) {
      setSelectedCustomer(null); // Deselect if already selected
      setCustomerName(null);
    } else {
      setSelectedCustomer(customerId); // Select the new customer
      setCustomerName(customerName);
    }
  };

  //continue adding customer name in the params to add to sales

  console.log(selectedCustomer);

  return (
    <>
      <TouchableOpacity
        style={{
          alignItems: "center",
          padding: 20,
          backgroundColor: "red",
          width: "100%",
        }}
        onPress={() => {
          router.push("driver/addCustomer");
        }}
      >
        <Text>Add Customer</Text>
      </TouchableOpacity>

      <Text
        style={{
          marginBottom: 10,
          fontWeight: "900",
          marginTop: 20,
          borderColor: "yellow",
          alignSelf: "center",
        }}
      >
        Select A customer:
      </Text>
      <View style={{ flex: 1, margin: 10 }}>
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
                width: "100%",
              }}
              onPress={() => {
                handleSelectCustomer(item.id, item.name);
              }}
            >
              <Text style={{ fontSize: 12 }}>{item.name}</Text>
              <Text style={{ fontSize: 12 }}>{item.address}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={{ alignItems: "center", backgroundColor: "blue", padding: 10 }}
        onPress={() => {
          router.push({
            pathname: "driver/addToSales",
            params: {
              prodIds: productIds,
              customerId: selectedCustomer,
              csName: customerName,
            },
          });
        }}
      >
        <Text>Confirm Selection</Text>
      </TouchableOpacity>
    </>
  );
};

export default Customer;
