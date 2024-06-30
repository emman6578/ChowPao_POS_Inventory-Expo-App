import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRoutesApi } from "@/libraries/API/protected/protectedRoutes";

const SingleProduct = () => {
  const [quantity, setQuantity] = useState<number>(1);

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { OneProduct, AddToCart } = useProtectedRoutesApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => OneProduct(id as string),
  });

  const mutation = useMutation({
    mutationFn: ({
      product_id,
      quantity,
    }: {
      product_id: string;
      quantity: number;
    }) => AddToCart(product_id, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addCart = async () => {
    if (data?.data) {
      mutation.mutate({ product_id: product.id, quantity });
      router.back();
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading product</Text>
      </View>
    );
  }

  const product = data?.data;

  const isAddToCartDisabled = product?.quantity <= product?.minimum_stock_level;

  return (
    <>
      <View>
        <Stack.Screen options={{ title: `Product: ${product?.name}` }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.title}>{product?.name}</Text>
        <Text style={styles.description}>{product?.description}</Text>

        {/* Body */}
        <Text style={styles.detail}>Barcod: {product?.barcode}</Text>
        <Text style={styles.detail}>Retail Price: &#8369;{product?.price}</Text>
        <Text style={styles.detail}>
          Wholesale Price: &#8369;{product?.wholesale_price}
        </Text>
        <Text style={styles.detail}>
          Weight: {product?.weight} ({product?.unit_of_measure})
        </Text>
        <Text style={styles.detail}>Quantity: {product?.quantity}</Text>
        <Text style={styles.detail}>Supplier: {product?.supplier}</Text>
        <Text style={styles.detail}>Stock Status: {product?.stock_status}</Text>

        <Text style={styles.detail}>
          Categories:{" "}
          {product?.Category.map((category: any) => category.name).join(", ")}
        </Text>

        <Text style={styles.detail}>Expiration: {product?.expiration}</Text>
        <Text style={styles.detail}>
          Date Manufacture: {product?.date_of_manufacture}
        </Text>
        <Text style={styles.detail}>
          Date Of Entry: {product?.date_of_entry}
        </Text>

        <Text style={styles.detail}>
          Minimum Stock Level: {product?.minimum_stock_level}
        </Text>
        <Text style={styles.detail}>
          Maximum Stock Level: {product?.maximum_stock_level}
        </Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.detail}>Quantity:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={(text) => {
              const newQuantity = Number(text);
              if (newQuantity <= product?.quantity) {
                setQuantity(newQuantity);
              }
            }}
            editable={!isAddToCartDisabled}
          />
        </View>

        <Pressable
          style={[styles.button, isAddToCartDisabled && styles.buttonDisabled]}
          onPress={addCart}
          disabled={isAddToCartDisabled}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "green",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    width: 100,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#e0e0e0",
  },
});

export default SingleProduct;
