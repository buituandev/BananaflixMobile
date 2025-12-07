import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { hexToRGBA } from '../utils/colorUtils';
import { getMovieRating, getMovieTitle } from '../utils/movieUtils';
import { useNavigation } from '@react-navigation/native';

const PADDING = 16;
const GAP = 16;
const { width } = Dimensions.get('window');

const ITEM_WIDTH = (width - (PADDING * 2) - GAP) / 2;

export default function SimilarMovies({ similarMoviesList }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = getStyles(colors, ITEM_WIDTH);

  const handleSimilarMovies = selectedSimilarMovie => {
    navigation.navigate('MovieDetails', { movie: selectedSimilarMovie });
  };

  return (
    <FlatList
      data={similarMoviesList.slice(0, 8)}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleSimilarMovies(item)}
        >
          <View style={styles.cardWrapper}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original/${item.posterPath}`,
              }}
              style={styles.moviePoster}
            />
            <View style={styles.ratingPill}>
              <IonIcon name='star' size={14} color={colors.accent} />
              <Text style={styles.ratingText}>{getMovieRating(item)}</Text>
            </View>
          </View>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {getMovieTitle(item)}
          </Text>
        </TouchableOpacity>
      )}
      numColumns={2}
      windowSize={2}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      scrollEnabled={false}
    />
  );
}


const getStyles = (themeColors, itemWidth) =>
  StyleSheet.create({
    listContainer: {
      paddingHorizontal: PADDING,
      gap: GAP,
      marginBottom: 16,
    },
    columnWrapper: {
      gap: GAP,
    },
    itemContainer: {
      width: itemWidth,
      borderRadius: 12,
    },
    cardWrapper: {
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: themeColors.surface,
    },
    moviePoster: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
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
    movieTitle: {
      color: themeColors.textPrimary,
      fontWeight: '600',
      fontSize: 14,
      marginTop: 6,
    },
  });