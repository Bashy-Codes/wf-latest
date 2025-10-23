import React, { forwardRef, useState, useCallback, useImperativeHandle } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { WFModal } from "./ui/WFModal";



export interface PickerItem {
  id: string;
  name: string;
  emoji: string;
}

interface ItemPickerModalProps {
  items: PickerItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onConfirm: () => void;
  multiSelect?: boolean;
  minSelection?: number;
  maxSelection?: number;
}

export interface ItemPickerModalRef {
  present: () => void;
  dismiss: () => void;
}

export const ItemPickerModal = forwardRef<ItemPickerModalRef, ItemPickerModalProps>(
  ({ items, selectedItems, onSelectionChange, onConfirm, multiSelect = false, minSelection = 0, maxSelection }, ref) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [tempSelectedItems, setTempSelectedItems] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      present: () => {
        setVisible(true);
        setTempSelectedItems(selectedItems);
      },
      dismiss: () => {
        setVisible(false);
        setTempSelectedItems([]);
      },
    }), [selectedItems]);

    const handleItemPress = useCallback(
      (itemId: string) => {
        if (multiSelect) {
          const isSelected = tempSelectedItems.includes(itemId);
          if (isSelected) {
            const newSelection = tempSelectedItems.filter((id) => id !== itemId);
            if (minSelection > 0 && newSelection.length < minSelection) {
              return;
            }
            setTempSelectedItems(newSelection);
          } else {
            if (maxSelection && tempSelectedItems.length >= maxSelection) {
              return;
            }
            const newSelection = [...tempSelectedItems, itemId];
            setTempSelectedItems(newSelection);
          }
        } else {
          setTempSelectedItems([itemId]);
        }
      },
      [tempSelectedItems, multiSelect, minSelection, maxSelection]
    );

    const handleClose = useCallback(() => {
      setVisible(false);
      setTempSelectedItems([]);
    }, []);

    const handleConfirm = useCallback(() => {
      if (minSelection > 0 && tempSelectedItems.length < minSelection) {
        return;
      }
      onSelectionChange(tempSelectedItems);
      onConfirm();
      setVisible(false);
      setTempSelectedItems([]);
    }, [onConfirm, tempSelectedItems, onSelectionChange, minSelection]);

    const styles = StyleSheet.create({
      listContainer: {
        height: verticalScale(400),
        marginHorizontal: scale(-8)
      },
      itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        borderRadius: theme.borderRadius.lg,
        marginVertical: verticalScale(4),
        backgroundColor: theme.colors.background,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      selectedItem: {
        backgroundColor: theme.colors.primary,
      },
      itemContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      },
      emoji: {
        fontSize: moderateScale(24),
        marginRight: scale(16),
      },
      itemName: {
        fontSize: moderateScale(16),
        color: theme.colors.text,
        fontWeight: "600",
      },
      selectedItemName: {
        color: theme.colors.white,
        fontWeight: "700",
      },
    });

    const renderItem = useCallback(
      ({ item }: { item: PickerItem }) => {
        const isSelected = tempSelectedItems.includes(item.id);
        return (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              isSelected && styles.selectedItem,
            ]}
            onPress={() => handleItemPress(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[
                styles.itemName,
                isSelected && styles.selectedItemName,
              ]}>
                {item.name}
              </Text>
            </View>
            {isSelected && (
              <Ionicons
                name="checkmark-circle"
                size={scale(24)}
                color={theme.colors.white}
              />
            )}
          </TouchableOpacity>
        );
      },
      [tempSelectedItems, handleItemPress, theme, styles]
    );

    const keyExtractor = useCallback((item: PickerItem) => item.id, []);

    return (
      <WFModal
        visible={visible}
        onClose={handleClose}
        onConfirm={handleConfirm}
        headerIcon="list"
        title={multiSelect ? `${tempSelectedItems.length}` : undefined}
      >
        <View style={styles.listContainer}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </WFModal>
    );
  }
);