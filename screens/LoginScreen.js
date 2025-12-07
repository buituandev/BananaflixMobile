import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { userloginAPI, checkAuthAPI } from '../api/userloginAPI';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colors, textInputTheme } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  useEffect(() => {
    const checkauthuser = async () => {
      const response = await checkAuthAPI();

      if (response.authenticated) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        navigation.replace('BottomTabNavigator', {
          screen: 'HomeScreen'
        });
      }
    };
    checkauthuser();
  }, [navigation]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setValidation(false);
      return;
    }

    setIsLoading(true);
    setValidation(true);

    const responseData = await userloginAPI(username, password);

    setIsLoading(false);

    if (responseData.success === false) {
      setValidation(false);
    } else {
      await AsyncStorage.setItem('user', JSON.stringify(responseData.user));
      navigation.replace('BottomTabNavigator', {
        screen: 'HomeScreen',
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ImageBackground resizeMode='cover' source={require('../assests/bg.png')} style={StyleSheet.absoluteFill}></ImageBackground>
        <View style={styles.contentContainer}>
          {/* Logo/Brand Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assests/bananflix.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>
              Bananaflix
            </Text>
            <Text style={styles.tagline}>
              We pick what best for you!
            </Text>
          </View>

          {/* Sign In Title */}
          <Text style={styles.title}>
            Sign In
          </Text>

          <TextInput
            label="Username"
            onChangeText={text => {
              setUsername(text);
              setValidation(true);
            }}
            mode="outlined"
            theme={textInputTheme}
            style={styles.input}
            value={username}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            label="Password"
            mode="outlined"
            theme={textInputTheme}
            style={styles.input}
            secureTextEntry={!showPassword}
            onChangeText={text => {
              setPassword(text);
              setValidation(true);
            }}
            value={password}
            autoCapitalize="none"
            right={
              <TextInput.Icon
                size={20}
                color={colors.textSecondary}
                onPress={() => setShowPassword(!showPassword)}
                icon={showPassword ? 'eye-outline' : 'eye-off-outline'}
              />
            }
          />

          {/* Error Message */}
          {!validation && (
            <View style={styles.errorContainer}>
              <IonIcon
                name="alert-circle"
                size={18}
                color={colors.error}
              />
              <Text style={styles.errorText}>
                Invalid username or password
              </Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.accentOn} /* onPrimary */ />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Not a member?{' '}
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Join us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 100,
      height: 100,
    },
    brandText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.accent,
      letterSpacing: 1,
      marginTop: 8,
    },
    tagline: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      fontStyle: 'italic',
    },
    title: {
      fontSize: 28,
      color: colors.textPrimary,
      marginBottom: 24,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
    input: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accentContainer,
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.error,
    },
    errorText: {
      color: colors.accent,
      fontSize: 14,
      marginLeft: 8,
      flex: 1,
    },
    loginButton: {
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 28,
      marginTop: 10,
      width: '100%',
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButtonDisabled: {
      backgroundColor: colors.neutralMuted,
      elevation: 0,
    },
    buttonText: {
      color: colors.accentOn,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    registerContainer: {
      flexDirection: 'row',
      marginTop: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    registerText: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    registerLink: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: 'bold',
    },
  });