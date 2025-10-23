import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

interface PostImagesProps {
  images: string[];
  onImagePress: (index: number) => void;
}

export const PostImages: React.FC<PostImagesProps> = ({ images, onImagePress }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: verticalScale(12),
      paddingHorizontal: scale(16)
    },
    imageScrollView: {
      flexDirection: "row",
    },
    image: {
      width: scale(200),
      height: verticalScale(150),
      borderRadius: scale(12),
      marginRight: scale(12),
      backgroundColor: theme.colors.surface
    },
    singleImage: {
      width: "100%",
      height: verticalScale(200),
      borderRadius: scale(12),
      backgroundColor: theme.colors.surface
    },
  });

  if (images.length === 1) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onImagePress(0)} activeOpacity={0.9}>
          <Image
            source={{ uri: images[0] }}
            style={styles.singleImage}
            contentFit="cover"
            transition={{ duration: 300, effect: "cross-dissolve" }}
            cachePolicy="memory-disk"
            placeholder={require("@/assets/images/photo.png")}
            priority="high"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
        {images.map((url, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onImagePress(index)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: url }}
              style={styles.image}
              contentFit="cover"
              transition={{ duration: 500, effect: "cross-dissolve" }}
              cachePolicy="memory-disk"
              placeholder={require("@/assets/images/photo.png")}
              priority="high"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};