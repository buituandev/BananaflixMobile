import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [version, setVersion] = useState('Version 1.0.0');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const DeviceInfo = await import('react-native-device-info');
        const appVersion = await DeviceInfo.getVersion();
        setVersion(`Version ${appVersion}`);
      } catch {
        setVersion('Version 1.0.0');
      }
    };
    fetchVersion();
  }, []);

  const features = [
    {
      icon: 'film-outline',
      title: 'Wishlist Movies',
      description: 'Wishlist your favorite movies and track them',
    },
    {
      icon: 'time-outline',
      title: 'Track Movies',
      description: 'Track your watched movies and add them to your watched list',
    },
    {
      icon: 'search-outline',
      title: 'Search Movies',
      description: 'Find movies quickly with advanced search',
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <IonIcon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          About Bananaflix
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.heroCard, { backgroundColor: cardBackground }]}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assests/bananflix.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            Bananaflix
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            We pick what best for you!
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.versionText, { color: colors.accentOn }]}>
              {version}
            </Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            About us
          </Text>
          <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
              Bananaflix curates the best movie selections across genres so you can
              build watchlists, track what you love, and discover new favorites faster.
              We focus on personalization, delightful UI, and dependable performance.
            </Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Features
          </Text>
          {features.map((feature, index) => (
            <View
              key={feature.title}
              style={[
                index === 0
                  ? styles.cardHead
                  : index === features.length - 1
                  ? styles.cardBottom
                  : styles.cardBody,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
                <IonIcon name={feature.icon} size={22} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            About Us
          </Text>
          {[
            {
              icon: 'business-outline',
              label: 'Bananaflix Technology Co., Ltd.',
            },
            {
              icon: 'location-outline',
              label: '中国广东省深圳市科技路188号 - No. 188 Science and Technology Road, Shenzhen, Guangdong, China',
            },
            {
              icon: 'mail-outline',
              label: 'support@bananaflix.com',
            },
            {
              icon: 'globe-outline',
              label: 'www.bananaflix.com',
            },
          ].map((info, idx, arr) => (
            <View
              key={info.label}
              style={[
                idx === 0
                  ? styles.cardHead
                  : idx === arr.length - 1
                  ? styles.cardBottom
                  : styles.cardBody,
                { backgroundColor: cardBackground },
              ]}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
                <IonIcon name={info.icon} size={20} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {info.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            © {new Date().getFullYear()} Bananaflix. All rights reserved.
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Crafted with ❤️ for movie lovers.
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
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      gap: 12,
    },
    logoContainer: {
      width: 72,
      height: 72,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.surface,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 999,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
    },
    tagline: {
      fontSize: 15,
      textAlign: 'center',
    },
    versionBadge: {
      paddingHorizontal: 18,
      paddingVertical: 6,
      borderRadius: 999,
    },
    versionText: {
      fontSize: 12,
      fontWeight: '700',
    },
    cardsContainer: {
      gap: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    infoCard: {
      borderRadius: 16,
      padding: 16,
    },
    bodyText: {
      fontSize: 15,
      lineHeight: 24,
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
      width: 48,
      height: 48,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
      gap: 4,
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

