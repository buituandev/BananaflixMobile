import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { hexToRGBA } from '../utils/colorUtils';
import { getMovieTitle } from '../utils/movieUtils';

export default function MovieBanner({
  moviesList,
  mylist,
  posterPlayButton,
  posterInfoButton,
  onAddToList,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const gradientColors = [
    'transparent',
    hexToRGBA(colors.background, 0.3),
    hexToRGBA(colors.background, 0.6),
    hexToRGBA(colors.background, 0.85),
    hexToRGBA(colors.background, 0.95),
    colors.background,
  ];

  const renderMovieBanner = ({ item }) => (
    <View>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/original/${item.posterPath}`,
        }}
        style={styles.posterImage}
        resizeMode="cover"
        resizeMethod='resize'
      >
        <LinearGradient
          colors={gradientColors}
          locations={[0, 0.4, 0.6, 0.75, 0.9, 1]}
          style={styles.linearGradient}
        >
          <View style={styles.contentContainer}>
            {/* Title */}
            <Text style={styles.movieTitle} numberOfLines={2}>
              {getMovieTitle(item)}
            </Text>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {/* My List button */}
              <TouchableOpacity
                style={styles.myListButton}
                onPress={() => onAddToList(item)} // Use the prop
              >
                {/* Change from mylist.some() to mylist.includes() */}
                {mylist.includes(item._id) ? (
                  <IonIcon
                    name="checkmark-circle"
                    size={30}
                    color={colors.textPrimary}
                  />
                ) : (
                  <IonIcon
                    name="add-circle-outline"
                    size={30}
                    color={colors.textPrimary}
                  />
                )}
                <Text style={styles.myListText}>My List</Text>
              </TouchableOpacity>

              {/* Play button */}
              <TouchableOpacity
                style={styles.posterPlayButton}
                onPress={() =>
                  posterPlayButton(item._id, item.downloadLink, item.title)
                }
              >
                <IonIcon name="play" size={28} color={colors.accentOn} />
                <Text style={styles.playText}>Trailer</Text>
              </TouchableOpacity>

              {/* Info button */}
              <TouchableOpacity
                style={styles.posterInfoButton}
                onPress={() => posterInfoButton(item)}
              >
                <IonIcon
                  name="information-circle-outline"
                  size={30}
                  color={colors.textPrimary}
                />
                <Text style={styles.infoText}>Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        pagingEnabled
        data={moviesList}
        keyExtractor={item => item._id}
        renderItem={renderMovieBanner}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const getStyles = themeColors =>
  StyleSheet.create({
    container: {
      height: responsiveHeight(70),
      width: '100%',
      position: 'relative',
    },
    posterImage: {
      width: responsiveWidth(100),
      height: '100%',
      justifyContent: 'flex-end',
    },
    linearGradient: {
      flex: 0.3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom: responsiveHeight(2),
      paddingHorizontal: responsiveWidth(4),
      position: 'relative',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    ratingPill: {
      position: 'absolute',
      top: responsiveHeight(4),
      left: responsiveWidth(4),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: hexToRGBA(themeColors.background, 0.7),
      gap: 6,
    },
    ratingText: {
      color: themeColors.textPrimary,
      fontWeight: '700',
    },
    movieTitle: {
      fontSize: responsiveFontSize(3.5),
      fontWeight: 'bold',
      color: themeColors.textPrimary,
      marginBottom: responsiveHeight(2),
      paddingRight: responsiveWidth(8),
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    myListButton: {
      alignItems: 'center',
    },
    posterInfoButton: {
      alignItems: 'center',
    },
    indicatorContainer: {
      position: 'absolute',
      right: responsiveWidth(4),
      top: responsiveHeight(3),
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicatorDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: themeColors.textSecondary,
      marginVertical: 4,
      opacity: 0.4,
    },
    indicatorDotActive: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: themeColors.accent,
      opacity: 1,
    },
    myListText: {
      color: themeColors.textPrimary,
      fontSize: responsiveFontSize(2),
      fontWeight: 'bold',
      marginTop: responsiveHeight(0.5),
    },
    posterPlayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: responsiveWidth(10),
      backgroundColor: themeColors.accent,
      width: responsiveWidth(28),
      justifyContent: 'center',
    },
    playText: {
      color: themeColors.accentOn,
      fontSize: responsiveFontSize(2),
      fontWeight: 'bold',
      marginLeft: responsiveWidth(1.5),
    },
    infoText: {
      color: themeColors.textPrimary,
      fontSize: responsiveFontSize(2),
      fontWeight: 'bold',
      marginTop: responsiveHeight(0.5),
    },
  });
