import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@/lib/Theme';

interface TimeSeparatorProps {
  text: string;
}

export const TimeSeparator: React.FC<TimeSeparatorProps> = ({ text }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: verticalScale(12),
    },
    text: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: moderateScale(12),
      paddingVertical: verticalScale(4),
      borderRadius: moderateScale(12),
      overflow: 'hidden',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};