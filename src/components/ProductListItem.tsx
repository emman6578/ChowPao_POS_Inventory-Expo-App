import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/src/components/Themed";

import { Product } from "@/libraries/Types/ProductTypes";
import { Link } from "expo-router";

export default function ProductListItem({ item }: { item: Product }) {
  return (
    <Link href={`/products/${item.id}`} asChild>
      <Pressable style={styles.productContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productDetails}>
          Retail Price: &#8369;{item.price}
        </Text>
        <Text style={styles.productDetails}>
          Wholesale Price: &#8369;{item.wholesale_price}
        </Text>
        <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.productDetails}>Quantity: {item.stock_status}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    overflow: "hidden",
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "#444",
  },
});
