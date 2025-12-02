import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { moviesListAPI } from '../api/movieList';
import { movieSearchAPI } from '../api/MovieSearchAPI';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SearchMovieList from '../components/SearchMovieList';
import { Searchbar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SearchScreen() {
  const { colors, textInputTheme } = useTheme();
  const styles = getStyles(colors);
  const [moviesList, setMoviesList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const movieListAPICall = async () => {
      const movies = await moviesListAPI();
      setMoviesList(movies);
    };

    movieListAPICall();
  }, []);

  const handleSearch = async text => {
    setSearchText(text);

    if (text.length > 2) {
      const results = await movieSearchAPI(text);
      setSearchResult(results);
    } else {
      setSearchResult([]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBarStyle}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search movies, shows..."
            theme={textInputTheme}
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={searchText}
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchResult.length > 0 ? (
          <View>
            <Text style={styles.resultsLabel}>
              {searchResult.length} Results Found
            </Text>
            <SearchMovieList data={searchResult} />
          </View>
        ) : searchText.length > 0 ? (
          <View style={styles.emptyContainer}>
            <IonIcon name="film-outline" size={80} color={colors.border} />
            <Text style={styles.emptyText}>No movies found</Text>
            <Text style={styles.emptySubtext}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.allMoviesLabel}>Popular Movies</Text>
            <SearchMovieList data={moviesList} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: themeColors.textPrimary,
      marginBottom: 20,
    },
    searchContainer: {
      marginBottom: 10,
    },
    searchInput: {
      backgroundColor: themeColors.surfaceVariant,
    },
    resultsLabel: {
      color: themeColors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
      marginVertical: 15,
      marginHorizontal: 20,
    },
    allMoviesLabel: {
      color: themeColors.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 15,
      marginHorizontal: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      color: themeColors.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
    },
    emptySubtext: {
      color: themeColors.textSecondary,
      fontSize: 14,
      marginTop: 8,
    },
  });
