import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { ProductCardProps } from "@/types/store";

const ProductCardComponent: React.FC<ProductCardProps> = ({ product, onPress, quantity }) => {
  const theme = useTheme();

  if (!product) return null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: scale(16),
      marginBottom: verticalScale(16),
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: "100%",
      height: verticalScale(120),
      borderRadius: theme.borderRadius.md,
      marginBottom: verticalScale(24),
    },
    title: {
      padding: scale(12),
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: verticalScale(4),
    },
    price: {
      padding: scale(12),
      margin: scale(12),
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: theme.colors.primary,
      textAlign: "center",
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: scale(12),
      margin: scale(12),
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      gap: scale(6),
    },
    quantity: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.primary,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: product.image || undefined }}
        style={styles.image}
        contentFit="contain"
        transition={{ duration: 300, effect: "cross-dissolve" }}
      />
      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      {quantity !== undefined ? (
        <View style={styles.quantityContainer}>
          <Ionicons name="cube" size={scale(16)} color={theme.colors.primary} />
          <Text style={styles.quantity}>{quantity}</Text>
        </View>
      ) : (
        <Text style={styles.price}>
          ${product.price}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const ProductCard = memo(ProductCardComponent);