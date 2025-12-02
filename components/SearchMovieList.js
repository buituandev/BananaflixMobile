import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { hexToRGBA } from '../utils/colorUtils';
import { useNavigation } from '@react-navigation/native';
import { getMovieRating, getMovieTitle } from '../utils/movieUtils';

export default function SearchMovieList({ navigation, data }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const formatReleaseDate = dateString => {
    const year = new Date(dateString).getFullYear();

    return year.toString();
  };

  const formatRuntime = minutes => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes} min`;
  };

  const handleMoviePress = movie => {
    navigation.navigate('MovieDetails', { movie });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => handleMoviePress(item)}>
        <View style={styles.movieContainer}>
          <View style={styles.posterWrapper}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original/${item.posterPath}`,
              }}
              style={styles.posterImage}
            />
            <View style={styles.ratingPill}>
              <IonIcon name='star' size={14} color={colors.accent} />
              <Text style={styles.ratingText}>{getMovieRating(item)}</Text>
            </View>
          </View>
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>
              {getMovieTitle(item)} ({formatReleaseDate(item.releaseDate)})
            </Text>
            <View style={styles.genreContainer}>
              {item.genres.map((genre, index) => (
                <View key={index} style={styles.genreItem}>
                  <Text style={styles.movieGenres}>{genre}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.movieRuntime}>
              {formatRuntime(item.runtime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      style={styles.flatList}
      scrollEnabled={false}
    />
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    flatList: {
      backgroundColor: themeColors.background,
    },
    movieContainer: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    posterWrapper: {
      position: 'relative',
    },
    posterImage: {
      width: 80,
      height: 120,
      marginRight: 10,
      borderRadius: 8,
    },
    ratingPill: {
      position: 'absolute',
      top: 6,
      left: 6,
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
    movieInfo: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    movieTitle: {
      color: themeColors.textPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    movieRuntime: {
      color: themeColors.textSecondary,
      fontSize: 14,
    },
    genreContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genreItem: {
      backgroundColor: themeColors.surfaceVariant,
      borderRadius: 12,
      marginRight: 5,
      marginBottom: 4,
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    movieGenres: {
      fontWeight: '600',
      color: themeColors.textPrimary,
      fontSize: 12,
    },
  });
