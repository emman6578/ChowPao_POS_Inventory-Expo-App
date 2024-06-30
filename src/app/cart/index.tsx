import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  Button,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router"; // Assuming 'Stack' import is not needed

const Cart = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantityToUpdate, setQuantityToUpdate] = useState<number>(1);

  const { GetCart, DeleteOnCart, CreateOrder, UpdateCartQuantity, UpdateCart } =
    useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: GetCart,
  });

  const deleteMutation = useMutation({
    mutationFn: (productInCartIds: string[]) => DeleteOnCart(productInCartIds),
    onSuccess: () => {
      refetch();
      setSelectedItems([]);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const orderMutation = useMutation({
    mutationFn: (productInCartIds: string[]) => CreateOrder(productInCartIds),
    onSuccess: () => {
      refetch();
      setSelectedItems([]);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      UpdateCartQuantity(quantity, id),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      Alert.alert("Error", "Maximum quantity exceeded \n" + err);
    },
  });

  const UpdateCartMutation = useMutation({
    mutationFn: UpdateCart,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setSelectedItems([]);
    setQuantityToUpdate(1);
    UpdateCartMutation.mutate();
    setRefreshing(false);
  }, [refetch]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleDeleteSelected = () => {
    deleteMutation.mutate(selectedItems);
  };

  const handleOrder = () => {
    orderMutation.mutate(selectedItems, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["product"] });
      },
    });
    deleteMutation.mutate(selectedItems);
  };

  const handleDelivery = () => {
    router.push({
      pathname: "/cart/selectDriver",
      params: { productIds: selectedItems },
    });
  };

  const handleUpdateQuantity = () => {
    // Only update if exactly one item is selected
    if (selectedItems.length === 1 && quantityToUpdate > 0) {
      updateQuantityMutation.mutate({
        id: selectedItems[0],
        quantity: quantityToUpdate,
      });
      setSelectedItems([]);
    }
  };

  const cart = data?.data;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen
        options={{
          title: `Cart: ${cart?.ProductInCart?.length}`,
          headerRight: () =>
            selectedItems.length !== 0 ? (
              <>
                <TouchableOpacity
                  onPress={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text>DELETE</Text>
                </TouchableOpacity>
              </>
            ) : null,
        }}
      />

      <View style={styles.headerRight}>
        {selectedItems.length === 1 ? (
          <TouchableOpacity
            onPress={handleUpdateQuantity}
            style={[styles.headerButton, { backgroundColor: "green" }]}
          >
            <Text>Update Quantity</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Retail Total Price: &#8369;{cart?.total_price.toFixed(2)}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Wholesale Total Price: &#8369;{cart?.wholesale_price.toFixed(2)}
        </Text>
      </View>

      {cart &&
        cart.ProductInCart.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.productContainer,
              selectedItems.includes(item.id) && styles.selectedItem,
            ]}
            onPress={() => handleSelectItem(item.id)}
          >
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Retail Total: &#8369;{item.total.toFixed(2)}</Text>
              <Text>
                Wholesale Total: &#8369;{item.wholesale_price_total.toFixed(2)}
              </Text>
            </View>

            {selectedItems.includes(item.id) && selectedItems.length === 1 && (
              <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={quantityToUpdate.toString()}
                  onChangeText={(text) => setQuantityToUpdate(Number(text))}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}

      <View style={{ marginBottom: 40 }}>
        <View style={{ marginVertical: 10 }}>
          <Button
            title="Make an order"
            onPress={handleOrder}
            color="green"
            disabled={selectedItems.length === 0}
          />
        </View>

        <Button
          title="Add to Delivery"
          onPress={handleDelivery}
          color="orange"
          disabled={selectedItems.length === 0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: "#d5ffd5", // Change this to the color you want for selected items
  },
  productDetails: {
    flex: 1, // Ensure the details take the remaining space
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    color: "black",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    width: 50,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  headerButton: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});

export default Cart;
