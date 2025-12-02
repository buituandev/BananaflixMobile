import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getWatchedMovies } from '../api/userWatchtimeAPI';
import { getMovieRating, getMovieTitle } from '../utils/movieUtils';
import { hexToRGBA } from '../utils/colorUtils';

const WatchedListScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [watchedMovies, setWatchedMovies] = useState([]);

  const goBack = () => {
    navigation.goBack();
  };

  const fetchWatchedMovies = useCallback(async () => {
    try {
      const response = await getWatchedMovies();
      const movies =
        response?.watchedMovies?.map(item => item.movie)?.filter(Boolean) ?? [];
      setWatchedMovies(movies);
    } catch (err) {
      setWatchedMovies([]);
    }
  }, []);

  const handleSelectMovie = movie => {
    navigation.navigate('MovieDetails', { movie });
  };

  useFocusEffect(
    useCallback(() => {
      fetchWatchedMovies();
    }, [fetchWatchedMovies]),
  );

  const MovieCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => handleSelectMovie(item)}
      >
        <View style={styles.posterWrapper}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original/${item.posterPath}`,
            }}
            style={styles.posterImage}
          />
          <View style={styles.ratingPill}>
            <IonIcon name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>{getMovieRating(item)}</Text>
          </View>
        </View>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {getMovieTitle(item)}
        </Text>
      </TouchableOpacity>
    );
  };


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
        <Text style={styles.headerText}>Watched List</Text>
        <View style={{ width: 40 }} />
      </View>
      {!watchedMovies.length ? (
        <View style={styles.centerContent}>
          <IonIcon name="eye-off-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No watched movies yet</Text>
          <Text style={styles.emptySubtitle}>
            Start watching something and it will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={watchedMovies}
          keyExtractor={item => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={MovieCard}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderRadius: 12,
      backgroundColor: themeColors.surface,
    },
    headerText: {
      fontSize: 22,
      fontWeight: '700',
      color: themeColors.textPrimary,
    },
    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    emptyTitle: {
      marginTop: 12,
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.textPrimary,
    },
    emptySubtitle: {
      marginTop: 4,
      fontSize: 14,
      textAlign: 'center',
      color: themeColors.textSecondary,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 16,
    },
    columnWrapper: {
      gap: 16,
    },
    movieCard: {
      flex: 1,
      borderRadius: 12,
    },
    posterWrapper: {
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: themeColors.surface,
    },
    posterImage: {
      width: '100%',
      height: 220,
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
      marginTop: 8,
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.textPrimary,
    },
  });

export default WatchedListScreen;
