import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [expandedFAQ, setExpandedFAQ] = React.useState(null);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Tap on the "Register" button on the login screen, fill in your details including username, email, age, and password, then tap "Create Account".',
    },
    {
      question: 'How do I add movies to My List?',
      answer: 'While browsing movies, tap the "+" icon on any movie poster or the "My List" button on the movie details page to add it to your personal list.',
    },
    {
      question: 'How do I change my profile information?',
      answer: 'Go to Settings > Profile, then tap "Edit Profile" to update your personal information.',
    },
    {
      question: 'How do I search for movies?',
      answer: 'Tap the search icon in the navigation bar, then type the movie title, genre, or actor name you\'re looking for.',
    },
    {
      question: 'Can I watch movies on this app?',
      answer: 'No! This app is only for wishlisting top selection movies and tracking movies. You cannot stream or download movies from this app.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      description: 'support@bananaflix.com',
      action: () => Linking.openURL('mailto:support@bananaflix.com'),
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      description: '+1 (800) 123-4567',
      action: () => Linking.openURL('tel:+18001234567'),
    },
    {
      icon: 'logo-wechat',
      title: 'Live Chat on Wechat',
      description: 'Available 24/7',
      action: () => {
        Linking.openURL('https://www.wechat.com/');
      },
    },
    {
      icon: 'logo-twitter',
      title: 'Twitter',
      description: '@BananaFlix',
      action: () => Linking.openURL('https://twitter.com/bananaflix'),
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const cardBackground = colors.surfaceVariant || colors.surface;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBarStyle}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <IonIcon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Help & Support
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.heroCard, { backgroundColor: cardBackground }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.accentContainer }]}>
            <IonIcon name="help-circle" size={42} color={colors.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
            How can we help?
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Browse common questions or reach out to our support crew anytime.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Contact us
          </Text>

          {contactOptions.map((option, index) => (
            <View
              key={option.title}
              style={[
                index === 0
                  ? styles.cardHead
                  : index === contactOptions.length - 1
                    ? styles.cardBottom
                    : styles.cardBody,
                { backgroundColor: cardBackground },
              ]}
            >
              <TouchableOpacity style={styles.touchable} onPress={option.action} />
              <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
                <IonIcon name={option.icon} size={22} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {option.title}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              <IonIcon
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          ))}
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            FAQs
          </Text>

          {faqs.map((faq, index) => (
            <View
              key={faq.question}
              style={[
                index === 0
                  ? styles.cardHead
                  : index === faqs.length - 1
                    ? styles.cardBottom
                    : styles.cardBody,
                { backgroundColor: cardBackground },
              ]}
            >
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => toggleFAQ(index)}
              />
              <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
                <IonIcon name="help-circle-outline" size={22} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {faq.question}
                </Text>
                {expandedFAQ === index && (
                  <Text
                    style={[styles.cardDescription, { color: colors.textSecondary }]}
                  >
                    {faq.answer}
                  </Text>
                )}
              </View>
              <IonIcon
                name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </View>
          ))}
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quick tips
          </Text>

          {[
            'Use search to quickly jump to any movie.',
            'Movies are added week based on top selection movies.',
            'This shows the most staff picked movies based on genres.',
          ].map((tip, idx) => (
            <View
              key={tip}
              style={[
                idx === 0
                  ? styles.cardHead
                  : idx === 2
                    ? styles.cardBottom
                    : styles.cardBody,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
                <IonIcon name="bulb-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {tip}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Need more help? Send us a message on Wechat.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
    backButton: {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'flex-start',
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
      padding: 24,
      alignItems: 'flex-start',
      gap: 12,
    },
    heroIcon: {
      width: 64,
      height: 64,
      borderRadius: 20,
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
    sectionTitle: {
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
      position: 'relative',
    },
    cardBody: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderRadius: 6,
      position: 'relative',
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
      position: 'relative',
    },
    cardIcon: {
      width: 46,
      height: 46,
      borderRadius: 9999,
      justifyContent: 'center',
      alignItems: 'center',
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
    touchable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    footer: {
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

