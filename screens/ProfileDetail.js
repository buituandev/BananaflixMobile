import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [user, setUser] = useState(null);

  const goBack = () => {
    navigation.goBack();
    Orientation.lockToPortrait();
    SystemNavigationBar.fullScreen(false);
  };

  const fetchUserFromAsyncStorage = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const parsedUser = JSON.parse(userJson);
        if (!parsedUser.avatar) {
          parsedUser.avatar = 'https://i.pravatar.cc/300';
        }
        setUser(parsedUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserFromAsyncStorage();
    }, [])
  )

  const cardBackground = colors.surfaceVariant;

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={colors.statusBarStyle}
        />
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

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
          Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarInfo}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </View>
            <View style={styles.avatarTextContainer}>
              <Text style={[styles.username, { color: colors.textPrimary }]}>
                @{user.username}
              </Text>
              <Text style={[styles.fullName, { color: colors.textSecondary }]}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={[styles.email, { color: colors.textSecondary }]}>
                {user.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Personal info
          </Text>

          <View style={[styles.cardHead, { backgroundColor: cardBackground }]}>
            <IonIcon name="person-circle-outline" size={24} color={colors.accent} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                First name
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {user.firstName}
              </Text>
            </View>
          </View>

          <View style={[styles.cardBody, { backgroundColor: cardBackground }]}>
            <IonIcon name="person-outline" size={24} color={colors.accent} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Last name
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {user.lastName}
              </Text>
            </View>
          </View>

          <View style={[styles.cardBody, { backgroundColor: cardBackground }]}>
            <IonIcon name="mail-outline" size={24} color={colors.accent} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Email
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {user.email}
              </Text>
            </View>
          </View>

          <View style={[styles.cardBody, { backgroundColor: cardBackground }]}>
            <IonIcon name="calendar-outline" size={24} color={colors.accent} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Age
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {user.age}
              </Text>
            </View>
          </View>

          <View style={[styles.cardBottom, { backgroundColor: cardBackground }]}>
            <IonIcon
              name={user.gender === 'Male' ? 'male' : 'female'}
              size={24}
              color={colors.accent}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Gender
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {user.gender}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            navigation.navigate('EditAccount', { user });
          }}
        >
          <IonIcon name="create-outline" size={20} color={colors.accentOn} />
          <Text style={[styles.editButtonText, { color: colors.accentOn }]}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderRadius: 12,
      backgroundColor: themeColors.surface,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
    },
    scrollContent: {
      paddingBottom: 40,
      gap: 24,
    },
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    },
    avatarInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      flex: 1,
    },
    avatarWrapper: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarTextContainer: {
      flex: 1,
    },
    username: {
      fontSize: 18,
      fontWeight: '600',
    },
    fullName: {
      fontSize: 16,
      marginTop: 4,
    },
    email: {
      marginTop: 2,
      fontSize: 14,
    },
    dropdownButton: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardsContainer: {
      gap: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
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
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 2,
    },
    cardDescription: {
      fontSize: 14,
    },
    editButton: {
      flexDirection: 'row',
      paddingVertical: 16,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    editButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default ProfileScreen;
