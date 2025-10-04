import React, { forwardRef, useState, useCallback, useImperativeHandle } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";

const { height: screenHeight } = Dimensions.get('window');

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
      modal: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
      },
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      contentContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        width: "90%",
        height: screenHeight * 0.8,
        padding: scale(16),
        marginBottom: verticalScale(24),
      },
      listContainer: {
        flex: 1,
      },
      itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderRadius: theme.borderRadius.md,
        marginVertical: verticalScale(2),
        backgroundColor: theme.colors.surface,
      },
      selectedItem: {
        backgroundColor: `${theme.colors.primary}15`,
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      itemContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      },
      emoji: {
        fontSize: moderateScale(18),
        marginRight: scale(12),
      },
      itemName: {
        fontSize: moderateScale(15),
        color: theme.colors.text,
        fontWeight: "500",
      },
      selectedItemName: {
        color: theme.colors.primary,
        fontWeight: "600",
      },
      buttonsContainer: {
        position: "absolute",
        bottom: verticalScale(24),
        left: scale(20),
        right: scale(20),
        flexDirection: "row",
        gap: scale(12),
      },
      actionButton: {
        flex: 1,
        height: verticalScale(44),
        borderRadius: theme.borderRadius.lg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      },
      cancelButton: {
        backgroundColor: theme.colors.error,
      },
      confirmButton: {
        backgroundColor: theme.colors.primary,
      },
      disabledButton: {
        backgroundColor: theme.colors.textMuted,
        opacity: 0.5,
      },
      buttonText: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: theme.colors.white,
        marginLeft: scale(6),
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
                name="checkmark"
                size={scale(18)}
                color={theme.colors.primary}
              />
            )}
          </TouchableOpacity>
        );
      },
      [tempSelectedItems, handleItemPress, theme, styles]
    );

    const keyExtractor = useCallback((item: PickerItem) => item.id, []);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View style={styles.modal}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <View style={styles.listContainer}>
                <FlatList
                  data={items}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: verticalScale(10),
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={scale(24)} color={theme.colors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.confirmButton,
                  tempSelectedItems.length < minSelection && styles.disabledButton,
                ]}
                onPress={handleConfirm}
                disabled={tempSelectedItems.length < minSelection}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={scale(24)} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);