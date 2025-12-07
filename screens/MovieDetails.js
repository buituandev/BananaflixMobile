import {
  Image,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';
import { similarMoviesAPI } from '../api/similarMoviesAPI';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import SimilarMovies from '../components/SimilarMovies';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  checkIfMovieInList,
  removeMovieFromList,
  addMovieToList,
} from '../api/mylistAPI';
import {
  updateWatchedMovie,
  removeWatchedMovie,
  getWatchtime,
  isWatchedMvs,
} from '../api/userWatchtimeAPI';
import { Snackbar } from 'react-native-paper';


const { width } = Dimensions.get('window');

export default function MovieDetails({ route, navigation }) {
  const { movie } = route.params;
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [similarMoviesList, setSimilarMoviesList] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isInList, setIsInList] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isUpdatingWatch, setIsUpdatingWatch] = useState(false);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkIfInList = async () => {
      const response = await checkIfMovieInList(movie._id);
      setIsInList(response.isInList);
    };

    checkIfInList();
  }, [movie]);

  useEffect(() => {
    const fetchWatchedStatus = async () => {
      try {
        const response = await isWatchedMvs(movie._id);
        setIsWatched(response.isInWatchedMovies);
      } catch (error) {
        setIsWatched(false);
      }
    };

    fetchWatchedStatus();
  }, [movie]);

  const addToList = async item => {
    try {
      let response;
      if (isInList) {
        response = await removeMovieFromList(item._id);
      } else {
        response = await addMovieToList(item._id);
      }

      const checkResponse = await checkIfMovieInList(item._id);
      setIsInList(checkResponse.isInList);

      setMessage('The list has been updated');
      setVisible(true);
    } catch (error) {
      console.log('Error adding/removing from list', error);
      setMessage('Failed to update list');
      setVisible(true);
    }
  };

  const handleToggleWatched = async () => {
    if (isUpdatingWatch) {
      return;
    }
    setIsUpdatingWatch(true);
    try {
      if (isWatched) {
        await removeWatchedMovie(movie._id);
        setIsWatched(false);
      } else {
        await updateWatchedMovie(movie._id);
        setIsWatched(true);
        if (isInList) {
          await removeMovieFromList(movie._id);
          setIsInList(false);
        }
      }
    } catch (error) {
      setMessage('Failed to update watched list');
      setVisible(true);
    } finally {
      setIsUpdatingWatch(false);
    }
  };

  useEffect(() => {
    const similarMoviesListAPICall = async () => {
      try {
        const similarMovies = await similarMoviesAPI(movie._id);
        setSimilarMoviesList(similarMovies);
      } catch (error) {
        console.error('Error fetching similar movies:', error);
      }
    };

    similarMoviesListAPICall();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [movie]);

  const goBack = () => {
    navigation.goBack();
    Orientation.lockToPortrait();
    SystemNavigationBar.fullScreen(false);
  };

  const playMovie = (movieID, movieLink, movieTitle) => {
    navigation.navigate('MoviesVideoPlayer', {
      movieID,
      movieLink,
      movieTitle,
    });
  };

  function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBarStyle}
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={[styles.headerGradient, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <IonIcon name="arrow-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {movie.title}
          </Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}`,
            }}
            style={styles.moviePoster}
          />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.posterGradient}
          />

          <TouchableOpacity onPress={goBack} style={styles.floatingBackButton}>
            <View style={styles.backButtonCircle}>
              <IonIcon name="arrow-back" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View style={styles.movieDetailsContainer}>
          <Text style={styles.movieTitle}>{movie.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <IonIcon
                name="calendar-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {new Date(movie.releaseDate).getFullYear()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <IonIcon
                name="time-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
            </View>
            <View style={styles.metaItem}>
              <IonIcon
                name="film-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>HD</Text>
            </View>
          </View>

          {/* Language & Subtitles */}
          <View style={styles.languageContainer}>
            <View style={styles.languageItem}>
              <IonIcon
                name="volume-high-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.languageText}>English | Vietnamese</Text>
            </View>
            <View style={styles.languageItem}>
              <IonIcon
                name="text-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.languageText}>EN</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() =>
              playMovie(movie._id, movie.downloadLink, movie.title)
            }
          >
            <IonIcon name="play" size={24} color="#000" />
            <Text style={styles.playButtonText}>Watch Trailer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => addToList(movie)}>
            {isInList ? (
              <IonIcon name="checkmark" size={24} color={colors.textPrimary} />
            ) : (
              <IonIcon name="add" size={24} color={colors.textPrimary} />
            )}
            <Text style={styles.actionButtonText}>My List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleWatched}
            disabled={isUpdatingWatch}
          >
            <IonIcon
              name={isWatched ? 'eye' : 'eye-outline'}
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.actionButtonText}>
              {isWatched ? 'Remove from watched list' : 'Add to watched list'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overview */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          {/* Genres */}
          <Text style={[styles.sectionTitle, styles.genresTitle]}>Genres</Text>
          <View style={styles.genresContainer}>
            {movie.genres.map((genre, index) => (
              <View key={index} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>

        {similarMoviesList.length > 0 && (
          <>
            <View style={styles.similarMovieTextContainer}>
              <Text style={styles.similarMovieText}>More Like This</Text>
            </View>
            <SimilarMovies similarMoviesList={similarMoviesList} />
          </>
        )}
      </Animated.ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'OK',
          onPress: () => {
            setVisible(false);
          },
        }}
        duration={3000}
      >
        {message}
      </Snackbar>
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    },
    headerGradient: {
      paddingTop: 35,
      paddingBottom: 5,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 15,
      color: themeColors.textPrimary,
    },
    posterContainer: {
      width: width,
      height: width * 1.2,
      position: 'relative',
    },
    moviePoster: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    posterGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 300,
    },
    floatingBackButton: {
      position: 'absolute',
      top: 20,
      left: 16,
    },
    backButtonCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    movieDetailsContainer: {
      paddingHorizontal: 20,
      marginTop: -40,
    },
    movieTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 15,
      color: themeColors.textPrimary,
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      marginBottom: 8,
    },
    metaText: {
      fontSize: 14,
      marginLeft: 6,
      color: themeColors.textSecondary,
    },
    languageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      marginBottom: 8,
    },
    languageText: {
      fontSize: 14,
      marginLeft: 6,
      color: themeColors.textSecondary,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      marginTop: 20,
      gap: 12,
    },
    playButton: {
      backgroundColor: themeColors.accent,
      paddingVertical: 16,
      borderRadius: 999,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: themeColors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    playButtonText: {
      color: themeColors.accentOn,
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 8,
    },
    actionButton: {
      paddingVertical: 14,
      borderRadius: 999,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: themeColors.surface,
      borderColor: themeColors.border,
    },
    actionButtonText: {
      fontWeight: '600',
      fontSize: 15,
      marginLeft: 8,
      color: themeColors.textPrimary,
    },
    detailsContainer: {
      paddingHorizontal: 20,
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: themeColors.textPrimary,
    },
    genresTitle: {
      marginTop: 20,
    },
    overview: {
      fontSize: 15,
      lineHeight: 24,
      color: themeColors.textSecondary,
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    genreChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: themeColors.surface,
      borderColor: themeColors.border,
    },
    genreText: {
      fontSize: 14,
      fontWeight: '500',
      color: themeColors.textPrimary,
    },
    similarMovieTextContainer: {
      paddingHorizontal: 20,
      marginTop: 30,
      marginBottom: 15,
    },
    similarMovieText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: themeColors.textPrimary,
    },
  });
