import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userRegisterAPI } from '../api/userRegisterAPI';
import React, { useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { colors, textInputTheme } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const statusBarStyle = colors.statusBarStyle;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = React.useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !age ||
      !email.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      setValidation(false);
      return;
    }

    setIsLoading(true);
    setValidation(true);

    const responseData = await userRegisterAPI(
      firstName,
      lastName,
      age,
      gender,
      email,
      username,
      password,
    );

    setIsLoading(false);

    if (responseData.success === false) {
      setValidation(false);
    } else if (responseData.success === true) {
      await AsyncStorage.setItem('user', JSON.stringify(responseData.user));
      navigation.navigate('LoginScreen');
    }
  };

  const handleLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={statusBarStyle}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.contentContainer}
          >
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleLogin}>
              <IonIcon
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            {/* Title */}
            <Text style={styles.title}>Create Account</Text>

            {/* Name Inputs Row */}
            <View style={styles.rowContainer}>
              <TextInput
                mode="outlined"
                theme={textInputTheme}
                style={[styles.textInput, styles.halfInput]}
                label="First Name"
                onChangeText={text => {
                  setFirstName(text);
                  setValidation(true);
                }}
                value={firstName}
                autoCapitalize="words"
              />
              <TextInput
                mode="outlined"
                theme={textInputTheme}
                style={[styles.textInput, styles.halfInput]}
                label="Last Name"
                onChangeText={text => {
                  setLastName(text);
                  setValidation(true);
                }}
                value={lastName}
                autoCapitalize="words"
              />
            </View>

            {/* Age Input */}
            <TextInput
              mode="outlined"
              theme={textInputTheme}
              style={styles.textInput}
              label="Age"
              keyboardType="numeric"
              left={
                <TextInput.Icon
                  icon={() => (
                    <IonIcon
                      name="calendar-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  )}
                />
              }
              onChangeText={text => {
                setAge(text);
                setValidation(true);
              }}
              value={age}
            />

            {/* Gender Selection */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                {['Male', 'Female', 'Other'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.genderButton,
                      gender === item && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(item)}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === item && styles.genderButtonTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Email Input */}
            <TextInput
              mode="outlined"
              theme={textInputTheme}
              style={styles.textInput}
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon={() => (
                    <IonIcon
                      name="mail-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  )}
                />
              }
              onChangeText={text => {
                setEmail(text);
                setValidation(true);
              }}
              value={email}
            />

            {/* Username Input */}
            <TextInput
              mode="outlined"
              theme={textInputTheme}
              style={styles.textInput}
              label="Username"
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon={() => (
                    <IonIcon
                      name="at-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  )}
                />
              }
              onChangeText={text => {
                setUsername(text);
                setValidation(true);
              }}
              value={username}
            />

            {/* Password Input */}
            <TextInput
              mode="outlined"
              theme={textInputTheme}
              style={styles.textInput}
              label="Password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon={() => (
                    <IonIcon
                      name="lock-closed-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  )}
                />
              }
              right={
                <TextInput.Icon
                  icon={() => (
                    <IonIcon
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  )}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              onChangeText={text => {
                setPassword(text);
                setValidation(true);
              }}
              value={password}
            />

            {/* Error Message */}
            {!validation && (
              <Animated.View style={styles.errorContainer}>
                <IonIcon name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>
                  Please fill all fields or username already exists!
                </Text>
              </Animated.View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.accentOn} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 30,
    },
    contentContainer: {
      width: '100%',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: themeColors.iconMuted,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logoText: {
      fontSize: 50,
      marginBottom: 5,
    },
    brandText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: themeColors.accent,
      letterSpacing: 1,
    },
    title: {
      fontSize: 26,
      color: themeColors.textPrimary,
      marginBottom: 25,
      fontWeight: 'bold',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    halfInput: {
      width: '48%',
    },
    textInput: {
      backgroundColor: themeColors.surface,
      marginBottom: 14,
      flex: 1,
    },
    genderContainer: {
      width: '100%',
      marginBottom: 14,
    },
    genderLabel: {
      color: themeColors.textPrimary,
      fontSize: 16,
      marginBottom: 10,
      fontWeight: '600',
    },
    genderButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    genderButton: {
      flex: 1,
      paddingVertical: 12,
      backgroundColor: themeColors.surface,
      borderRadius: 12,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: themeColors.border,
      alignItems: 'center',
    },
    genderButtonActive: {
      backgroundColor: themeColors.accent,
      borderColor: themeColors.accent,
    },
    genderButtonText: {
      color: themeColors.textSecondary,
      fontSize: 15,
      fontWeight: '600',
    },
    genderButtonTextActive: {
      color: themeColors.accentOn,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.errorBackground,
      padding: 12,
      borderRadius: 12,
      marginBottom: 14,
      width: '100%',
      borderLeftWidth: 3,
      borderLeftColor: themeColors.error,
    },
    errorText: {
      color: themeColors.error,
      fontSize: 14,
      marginLeft: 8,
      flex: 1,
    },
    registerButton: {
      backgroundColor: themeColors.accent,
      paddingVertical: 16,
      borderRadius: 28,
      marginTop: 10,
      width: '100%',
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    registerButtonDisabled: {
      backgroundColor: themeColors.accentMuted,
      opacity: 0.7,
    },
    buttonText: {
      color: themeColors.accentOn,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    loginContainer: {
      flexDirection: 'row',
      marginTop: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginText: {
      color: themeColors.textSecondary,
      fontSize: 15,
    },
    loginLink: {
      color: themeColors.accent,
      fontSize: 15,
      fontWeight: 'bold',
    },
  });
