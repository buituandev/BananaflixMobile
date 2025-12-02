
import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { updateProfileAPI } from '../api/updateProfileAPI';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditAccount = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { colors, textInputTheme } = useTheme();
	const styles = React.useMemo(() => getStyles(colors), [colors]);

	// Lấy dữ liệu user từ params
	const user = route.params?.user || {};
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [age, setAge] = useState(user.age ? String(user.age) : '');
	const [gender, setGender] = useState(user.gender || 'Male');
	const [validation, setValidation] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');


	const handleSave = async () => {
		if (!firstName.trim() || !lastName.trim() || !email.trim() || !age.trim()) {
			setValidation(false);
			setErrorMsg('Please fill all fields!');
			return;
		}
		setIsLoading(true);
		setValidation(true);
		setErrorMsg('');
		try {
			const res = await updateProfileAPI(firstName, lastName, age, gender, email);
			if (res.success) {
				await AsyncStorage.setItem('user', JSON.stringify(res.user));
				navigation.navigate('ProfileDetail', {
					params: {
						...user,
					},
				});
			} else {
				setValidation(false);
				setErrorMsg(res.error || 'Update failed!');
			}
		} catch (err) {
			setValidation(false);
			setErrorMsg('Network or server error!');
		}
		setIsLoading(false);
	};

	const handleCancel = () => {
		navigation.goBack();
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<StatusBar translucent backgroundColor="transparent" barStyle={colors.statusBarStyle} />
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<View style={styles.header}>
						<TouchableOpacity style={styles.backButton} onPress={handleCancel}>
							<IonIcon name="arrow-back" size={24} color={colors.textPrimary} />
						</TouchableOpacity>
						<Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
					</View>

					<View style={styles.formContainer}>
						<Text style={styles.label}>First Name</Text>
						<TextInput
							mode="outlined"
							theme={textInputTheme}
							style={styles.input}
							value={firstName}
							onChangeText={text => {
								setFirstName(text);
								setValidation(true);
							}}
							autoCapitalize="words"
						/>

						<Text style={styles.label}>Last Name</Text>
						<TextInput
							mode="outlined"
							theme={textInputTheme}
							style={styles.input}
							value={lastName}
							onChangeText={text => {
								setLastName(text);
								setValidation(true);
							}}
							autoCapitalize="words"
						/>

						<Text style={styles.label}>Email</Text>
						<TextInput
							mode="outlined"
							theme={textInputTheme}
							style={styles.input}
							value={email}
							onChangeText={text => {
								setEmail(text);
								setValidation(true);
							}}
							keyboardType="email-address"
							autoCapitalize="none"
						/>

						<Text style={styles.label}>Age</Text>
						<TextInput
							mode="outlined"
							theme={textInputTheme}
							style={styles.input}
							value={age}
							onChangeText={text => {
								setAge(text);
								setValidation(true);
							}}
							keyboardType="numeric"
						/>

						<Text style={styles.label}>Gender</Text>
						<View style={styles.genderContainer}>
							{['Male', 'Female', 'Other'].map(item => (
								<TouchableOpacity
									key={item}
									style={[styles.genderButton, gender === item && styles.genderButtonActive]}
									onPress={() => setGender(item)}
								>
									<Text style={[styles.genderButtonText, gender === item && styles.genderButtonTextActive]}>{item}</Text>
								</TouchableOpacity>
							))}
						</View>

						{!validation && (
							<View style={styles.errorContainer}>
								<IonIcon name="alert-circle" size={16} color={colors.error} />
								<Text style={styles.errorText}>{errorMsg || 'Please fill all fields!'}</Text>
							</View>
						)}

						<View style={styles.buttonRow}>
							<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={isLoading}>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isLoading}>
								{isLoading ? (
									<Text style={[styles.buttonText, { color: colors.accentOn }]}>Saving...</Text>
								) : (
									<Text style={[styles.buttonText, { color: colors.accentOn }]}>Save</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
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
			marginLeft: 16,
		},
		scrollContent: {
			paddingBottom: 40,
		},
		formContainer: {
			gap: 12,
		},
		label: {
			fontSize: 15,
			color: themeColors.textPrimary,
			fontWeight: '600',
			marginBottom: 4,
		},
		input: {
			backgroundColor: themeColors.surface,
			marginBottom: 8,
		},
		genderContainer: {
			flexDirection: 'row',
			gap: 8,
			marginBottom: 8,
		},
		genderButton: {
			flex: 1,
			paddingVertical: 12,
			backgroundColor: themeColors.surface,
			borderRadius: 12,
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
			marginBottom: 8,
			borderLeftWidth: 3,
			borderLeftColor: themeColors.error,
		},
		errorText: {
			color: themeColors.error,
			fontSize: 14,
			marginLeft: 8,
			flex: 1,
		},
		buttonRow: {
			flexDirection: 'row',
			gap: 12,
			marginTop: 16,
		},
		button: {
			flex: 1,
			paddingVertical: 14,
			borderRadius: 28,
			alignItems: 'center',
			justifyContent: 'center',
		},
		cancelButton: {
			backgroundColor: themeColors.neutralMuted,
		},
		saveButton: {
			backgroundColor: themeColors.accent,
		},
		buttonText: {
			color: themeColors.textPrimary,
			fontSize: 16,
			fontWeight: 'bold',
		},
	});

export default EditAccount;
