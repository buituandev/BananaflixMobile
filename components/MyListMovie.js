import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { mylistAPI } from '../api/mylistAPI';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { hexToRGBA } from '../utils/colorUtils';
import { getMovieRating, getMovieTitle } from '../utils/movieUtils';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default function MylistMovies({ navigation, mylist, label }) {
  const [moviesList, setMoviesList] = useState([]);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handleMovieDetails = movie => {
    navigation.navigate('MovieDetails', { movie });
  };

  useEffect(() => {
    const fetchMyListMovies = async () => {
      const movies = await mylistAPI();
      setMoviesList(movies.moviesInMyList);
    };
    fetchMyListMovies();
  }, [mylist]);

  const renderMovieCards = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMovieDetails(item)}
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
          <IonIcon name='star' size={14} color={colors.accent} />
          <Text style={styles.ratingText}>{getMovieRating(item)}</Text>
        </View>
        <LinearGradient
          colors={['transparent', hexToRGBA(colors.background, 0.9)]}
          style={styles.cardGradient}
        >
          <Text style={styles.movieTitle} numberOfLines={2}>
            {getMovieTitle(item)}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        data={moviesList}
        keyExtractor={item => item._id}
        renderItem={renderMovieCards}
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
      height: 250,
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
      borderRadius: 20,
    },
    cardWrapper: {
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
    },
    moviecardImage: {
      width: 150,
      height: '100%',
      borderRadius: 10,
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
    cardGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
      justifyContent: 'flex-end',
    },
    movieTitle: {
      color: 'white',
      fontWeight: '600',
      fontSize: responsiveFontSize(2),
    },
  });
