import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { moviesListAPI } from '../api/movieList';
import MovieBanner from '../components/MovieBanner';
import MyListMovie from '../components/MyListMovie';
import MovieCards from '../components/MovieCards';
import { mylistID } from '../api/mylistAPI';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addMovieToList, removeMovieFromList } from '../api/mylistAPI';
import { hexToRGBA } from '../utils/colorUtils';
import GENRE_CONFIG from '../const/genre';

export default function HomeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const headerGradientColors = getHeaderGradientColors(colors.background);
  const [moviesList, setMoviesList] = useState([]);
  const [mylist, setMylist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [genreSections, setGenreSections] = useState([]);

  const fetchLatestMovies = async () => {
    try {
      const movies = await moviesListAPI();
      const listId = await mylistID();
      const latestMovies = movies
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 4);
      setMoviesList(latestMovies);
      setMylist(listId.mylist);
    } catch (error) {
      console.error('Error fetching movies list:', error);
      setMessage('Error fetching movies list');
      setVisible(true);
    }
  };

  const fetchGenreSections = async () => {
    try {
      const sections = await Promise.all(
        GENRE_CONFIG.map(async genre => {
          const movies = await moviesListAPI(genre.id);
          return {
            ...genre,
            movies: Array.isArray(movies) ? movies : [],
          };
        }),
      );
      setGenreSections(sections.filter(section => section.movies.length > 0));
    } catch (error) {
      console.error('Error fetching genre sections:', error);
      setMessage('Error fetching genre sections');
      setVisible(true);
    }
  };

  useEffect(() => {
    fetchLatestMovies();
    fetchGenreSections();
  }, []);

  const handleAddToList = async (item) => {
    try {
      let response;
      const isInList = mylist.includes(item._id);

      if (isInList) {
        response = await removeMovieFromList(item._id);
      } else {
        response = await addMovieToList(item._id);
      }

      setMylist(response.user.mylist);
      setMessage(isInList ? 'Removed from My List' : 'Added to My List');
      setVisible(true);
    } catch (error) {
      console.log('Error adding/removing from list', error);
      setMessage('Error adding/removing from list');
      setVisible(true);
    }
  };

  //useCallback with useFocusEffect ensures the effect only runs when you navigate to the screen, not on every render. It's a performance optimization and best practice recommended by React Navigation's documentation.
  useFocusEffect(
    useCallback(() => {
      const updateMylist = async () => {
        try {
          const updatedMyList = await mylistID();
          setMylist(updatedMyList.mylist);
        } catch (error) {
          console.error('Error updating mylist:', error);
          setMessage('Error updating mylist');
          setVisible(true);
        }
      };

      updateMylist();
    }, [])
  );

  const handleBanner = movie => {
    console.log('Handle banner', movie);
  };

  const posterPlayButton = (movieID, movieLink, movieTitle) => {
    navigation.navigate('MoviesVideoPlayer', {
      movieID,
      movieLink,
      movieTitle,
    });
  };

  const posterInfoButton = movie => {
    navigation.navigate('MovieDetails', { movie });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchLatestMovies(), fetchGenreSections()]); //Chạy 2 hàm song song thay vì chạy từng hàm để hàm sau chờ hàm trước. Nhưng 1 hàm lỗi, sẽ ko chạy cái sau.
    } catch (error) {
      console.error('Error refreshing:', error);
      setMessage('Error refreshing data');
      setVisible(true);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colors.statusBarStyle}
      />
      <View style={styles.header}>
        <LinearGradient
          colors={headerGradientColors}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerLogo}>Bananaflix</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.search}
                onPress={() => navigation.navigate('SearchScreen')}
              >
                <IonIcon
                  name="search-outline"
                  size={24}
                  color='black'
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate('ProfileDetail', route.params)}
              >
                <Avatar.Image source={{ uri: 'https://i.pravatar.cc/300' }} size={36} icon="notifications-outline" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.background}
          />
        }
      >
        <MovieBanner
          moviesList={moviesList}
          mylist={mylist}
          handleBanner={handleBanner}
          posterPlayButton={posterPlayButton}
          posterInfoButton={posterInfoButton}
          onAddToList={handleAddToList}
        />
        <View style={styles.subContainer}>
          {mylist.length !== 0 && (
            <MyListMovie label={'My List'} mylist={mylist} />
          )}
          {genreSections.map(section => (
            <MovieCards
              key={section.id}
              refresh={refreshing}
              genreID={section.id}
              label={`Top ${section.name} Movies`}
              movies={section.movies}
            />
          ))}
        </View>
      </ScrollView>
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
    </View>
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      elevation: 10,
    },
    headerGradient: {
      padding: 16,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLogo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      letterSpacing: 0.5,
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 8
    },
    search: {
      paddingHorizontal: 15,
      backgroundColor: 'white',
      borderRadius: 90,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
    },
    subContainer: {
      paddingHorizontal: 15,
      gap: 10,
      marginTop: 20,
      paddingBottom: 30,
    },
  });

const getHeaderGradientColors = (background) => [
  hexToRGBA(background, 1),
  hexToRGBA(background, 0.5),
  hexToRGBA(background, 0),
  'transparent',
];