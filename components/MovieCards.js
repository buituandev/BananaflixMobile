import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { moviesListAPI } from '../api/movieList';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { hexToRGBA } from '../utils/colorUtils';
import { getMovieRating, getMovieTitle } from '../utils/movieUtils';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default function MovieCards({ navigation, refresh, genreID, label, movies }) {
  const [moviesList, setMoviesList] = useState(
    Array.isArray(movies) ? movies : [],
  );
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const gradientColors = ['transparent', hexToRGBA(colors.background, 1)];

  const handleMovieDetails = movie => {
    navigation.navigate('MovieDetails', { movie });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      if (Array.isArray(movies)) {
        setMoviesList(movies);
        return;
      }
      const fetchedMovies = await moviesListAPI(genreID);
      if (isMounted) {
        setMoviesList(Array.isArray(fetchedMovies) ? fetchedMovies : []);
      }
    };
    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, [genreID, refresh, movies]);


  const MovieCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleMovieDetails(item)}
        activeOpacity={0.9}
        style={styles.movieCardContainer}
      >
        <View style={styles.cardWrapper}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${item.posterPath}`,
            }}
            style={styles.moviecardImage}
          />
          <View style={styles.ratingPill}>
            <IonIcon name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>{getMovieRating(item)}</Text>
          </View>
          <LinearGradient
            colors={gradientColors}
            style={styles.cardGradient}
          >
            <Text style={styles.movieTitle} numberOfLines={2}>
              {getMovieTitle(item)}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMovieCards = ({ item }) => <MovieCard item={item} />;

  if (!moviesList || moviesList.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        data={moviesList.slice(0, 10)}
        keyExtractor={item => item._id}
        renderItem={renderMovieCards}
        windowSize={2}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      height: 280,
    },
    label: {
      paddingHorizontal: 10,
      marginBottom: 10,
      fontSize: responsiveFontSize(2.5),
      fontWeight: 'bold',
      color: themeColors.textPrimary,
    },
    movieCardContainer: {
      marginRight: 10,
      marginBottom: 20,
    },
    cardWrapper: {
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    },
    moviecardImage: {
      width: 150,
      height: 240,
      borderRadius: 16,
    },
    cardGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
      paddingBottom: 20,
      justifyContent: 'flex-end',
    },
    movieTitle: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    ratingPill: {
      position: 'absolute',
      top: 10,
      left: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: hexToRGBA(themeColors.background, 0.75),
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      color: themeColors.textPrimary,
      fontWeight: '700',
      fontSize: 12,
    },
  });
