import { useTheme } from "@/lib/Theme"
import { forwardRef, useImperativeHandle, useState, useCallback } from "react"
import { StyleSheet, Modal, View, TouchableOpacity, Text } from "react-native"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"
import { Ionicons } from "@expo/vector-icons"

export interface ActionModalOption {
  id: string
  title: string
  icon: string
  color?: string
  onPress: () => void
}

interface ActionModalProps {
  options: ActionModalOption[]
}

export interface ActionModalRef {
  present: () => void
  dismiss: () => void
}

export const ActionModal = forwardRef<ActionModalRef, ActionModalProps>(({ options }, ref) => {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    dismiss: () => setVisible(false),
  }), [])

  const handleClose = useCallback(() => {
    setVisible(false)
  }, [])

  const handleOptionPress = useCallback((option: ActionModalOption) => {
    option.onPress()
    handleClose()
  }, [handleClose])

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      padding: scale(46),
      minWidth: scale(300),
      gap: verticalScale(12),
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(18),
      paddingHorizontal: scale(20),
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    optionText: {
      fontSize: moderateScale(16),
      fontWeight: "500",
      marginLeft: scale(12),
      flex: 1,
    },
  })

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modal}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View style={styles.container}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.option}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon as any}
                size={scale(20)}
                color={option.color || theme.colors.text}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: option.color || theme.colors.text }
                ]}
              >
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  )
});