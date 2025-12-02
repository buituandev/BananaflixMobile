import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userLogoutAPI } from '../api/logoutAPI';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const handleLogout = async () => {
    try {
      const response = await userLogoutAPI();
      if (response.success) {
        navigation.navigate('LoginScreen');
      } else {
        console.error('Logout failed:', response.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const profileNavigation = () => {
    navigation.navigate('ProfileDetail', route.params);
  };

  const policyNavigation = () => {
    navigation.navigate('PolicyScreen');
  };

  const notiNavigation = () => {
    navigation.navigate('NotificationScreens');
  };

  const aboutNavigation = () => {
    navigation.navigate('AboutScreen');
  };

  const helpNavigation = () => {
    navigation.navigate('HelpSupportScreen');
  };

  const cardBackground = colors.surfaceVariant || colors.surface;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBarStyle}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Dashboard
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Account
          </Text>

          <View style={[styles.cardSingle, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={profileNavigation}
            />
            <View style={[styles.cardIcon, { backgroundColor: colors.accent }]}>
              <IonIcon name="person" size={22} color={colors.accentOn} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                My Profile
              </Text>
              <Text
                style={[styles.cardDescription, { color: colors.textSecondary }]}
              >
                Manage your account
              </Text>
            </View>
            <IonIcon
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            General
          </Text>

          <View style={[styles.cardHead, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={notiNavigation}
            />
            <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
              <IonIcon
                name="eye-outline"
                size={22}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Watched List
              </Text>
              <Text
                style={[styles.cardDescription, { color: colors.textSecondary }]}
              >
                Track everything you've finished watching
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={policyNavigation}
            />
            <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
              <IonIcon
                name="document-text-outline"
                size={22}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Terms & Policies
              </Text>
              <Text
                style={[styles.cardDescription, { color: colors.textSecondary }]}
              >
                Review app policies
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={helpNavigation}
            />
            <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
              <IonIcon
                name="help-circle-outline"
                size={22}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Help & Support
              </Text>
              <Text
                style={[styles.cardDescription, { color: colors.textSecondary }]}
              >
                Get assistance anytime
              </Text>
            </View>
          </View>

          <View style={[styles.cardBottom, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={aboutNavigation}
            />
            <View style={[styles.cardIcon, { backgroundColor: colors.surface }]}>
              <IonIcon
                name="information-circle-outline"
                size={22}
                color={colors.textPrimary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                About BananaFlix
              </Text>
              <Text
                style={[styles.cardDescription, { color: colors.textSecondary }]}
              >
                About us
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.accent }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutButtonText, { color: colors.accentOn }]}>
            Logout
          </Text>
        </TouchableOpacity>
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
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
    },
    scrollViewContent: {
      padding: 16,
      gap: 24,
      paddingBottom: 32,
    },
    cardsContainer: {
      gap: 4,
    },
    sectionLabel: {
      fontSize: 18,
      letterSpacing: 1,
      fontWeight: '600',
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
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderRadius: 6,
      position: 'relative',
    },
    cardSingle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderRadius: 16,
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    cardDescription: {
      fontSize: 13,
      marginTop: 2,
    },
    touchable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    logoutButton: {
      flexDirection: 'row',
      paddingVertical: 18,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default SettingsScreen;
