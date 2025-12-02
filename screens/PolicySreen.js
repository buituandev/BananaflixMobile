import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const PolicyScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const goBack = () => {
    navigation.goBack();
  };

  const sections = [
    {
      icon: 'information-circle-outline',
      title: '1. Introduction',
      content:
        'By using this application, you agree to comply with and be bound by these terms. Bananaflix provides unlimited streaming entertainment for your enjoyment.',
    },
    {
      icon: 'shield-checkmark-outline',
      title: '2. Privacy Policy',
      content:
        'We are committed to protecting your privacy. Your data will not be shared with third parties without your consent. We use industry-standard encryption to protect your information.',
    },
    {
      icon: 'person-outline',
      title: '3. User Responsibilities',
      content:
        'Users are expected to use the application responsibly and avoid any harmful activities. You must be at least 13 years old to use this service.',
    },
    {
      icon: 'create-outline',
      title: '4. Modifications',
      content:
        'We reserve the right to modify these terms at any time. Please check this page regularly for updates. Continued use of the service constitutes acceptance of changes.',
    },
    {
      icon: 'mail-outline',
      title: '5. Contact Us',
      content:
        'If you have any questions about these terms, please contact us at support@bananaflix.com. We typically respond within 24-48 hours.',
    },
  ];

  const cardBackground = colors.surfaceVariant || colors.surface;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBarStyle}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <IonIcon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Terms & Policies
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.heroCard, { backgroundColor: cardBackground }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.surface }]}>
            <IonIcon name="document-text-outline" size={32} color={colors.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            Terms & Policies
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Review our latest terms and privacy practices before continuing to use the
            app.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
            Policy overview
          </Text>

          {sections.map((section, index) => (
            <View
              key={section.title}
              style={[
                index === 0
                  ? styles.cardHead
                  : index === sections.length - 1
                  ? styles.cardBottom
                  : styles.cardBody,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
                <IonIcon name={section.icon} size={22} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {section.title}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {section.content}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Last updated: November 2025
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            © {new Date().getFullYear()} Bananaflix. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.surface,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
      gap: 24,
    },
    heroCard: {
      borderRadius: 20,
      padding: 20,
      gap: 12,
    },
    heroIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: '700',
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 20,
    },
    cardsContainer: {
      gap: 4,
    },
    sectionLabel: {
      fontSize: 18,
      fontWeight: '700',
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    },
    cardBody: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderRadius: 6,
    },
    cardBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    cardIcon: {
      width: 46,
      height: 46,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
      gap: 6,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    cardDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    footer: {
      alignItems: 'center',
      gap: 4,
    },
    footerText: {
      fontSize: 12,
    },
  });

export default PolicyScreen;
