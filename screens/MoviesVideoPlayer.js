import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Orientation from 'react-native-orientation-locker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import React, { useRef, useState, useEffect } from 'react';

export default function MoviesVideoPlayer({ route }) {
  const { movieTitle } = route.params;
  const navigation = useNavigation();
  const [videoPressed, setVideoPressed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resizeMode, setResizeMode] = useState('cover');

  const ref = useRef();

  useEffect(() => {
    Orientation.lockToLandscape();
    SystemNavigationBar.fullScreen(true);
  }, []);

  const handleVideoPress = () => {
    setVideoPressed(!videoPressed);
  };

  const moveBackward = () => {
    ref.current.seek(parseInt(progress.currentTime - 10));
  };

  const pauseVideo = () => {
    setIsPaused(true);
  };

  const playVideo = () => {
    setIsPaused(false);
  };

  const moveForward = () => {
    ref.current.seek(parseInt(progress.currentTime + 10));
  };

  const handleMute = () => {
    setIsMute(true);
  };

  const handleVolumeUp = () => {
    setIsMute(false);
  };

  const handleZoomIn = () => {
    setResizeMode('none');
  };

  const handleZoomOut = () => {
    setResizeMode('cover');
  };

  const formatDuration = durationInSeconds => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = `${minutes < 10 && hours > 0 ? '0' : ''
      }${minutes}:`;
    const formattedSeconds = `${seconds < 10 ? '0' : ''}${seconds}`;

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  };

  const goBack = () => {
    navigation.goBack();
    Orientation.lockToPortrait();
    SystemNavigationBar.fullScreen(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.videoWrapper}>
        <TouchableOpacity style={styles.backgroundVideo}>
          <Video
            source={{
              uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            paused={isPaused}
            muted={isMute}
            style={styles.video}
            resizeMode={resizeMode}
            ref={ref}
            onProgress={prog => {
              setProgress(prog);
            }}
          />
          <TouchableOpacity
            onPress={() => handleVideoPress()}
            style={[
              styles.videoscreenContainer,
              {
                backgroundColor: videoPressed
                  ? 'rgba(0,0,0,0.5)'
                  : 'rgba(0,0,0,0)',
              },
            ]}
          >
            {!videoPressed ? (
              <View></View>
            ) : (
              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => moveBackward()}
                >
                  <Image
                    source={require('../assests/backward.png')}
                    style={styles.controlIcon}
                  />
                </TouchableOpacity>
                {isPaused ? (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => playVideo()}
                  >
                    <Image
                      source={require('../assests/play-button-arrowhead.png')}
                      style={styles.controlIconLarge}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => pauseVideo()}
                  >
                    <Image
                      source={require('../assests/pause.png')}
                      style={styles.controlIconLarge}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => moveForward()}
                >
                  <Image
                    source={require('../assests/forward.png')}
                    style={styles.controlIcon}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View
              style={[
                styles.backButtonContainer,
                { opacity: videoPressed ? 1 : 0 },
              ]}
            >
              <TouchableOpacity onPress={() => goBack()}>
                <Image
                  source={require('../assests/back.png')}
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <Text style={styles.movieTitleText}>{movieTitle}</Text>
            </View>


            <View
              style={[
                styles.sliderContainer,
                { opacity: videoPressed ? 1 : 0 },
              ]}
            >
              <Text style={styles.sliderText}>
                {formatDuration(progress.currentTime)}
              </Text>
              <Slider
                style={styles.sliderProgressBar}
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor="red"
                maximumTrackTintColor="white"
                thumbTintColor="red"
                onValueChange={prog => {
                  ref.current.seek(prog);
                }}
                value={progress.currentTime}
              />
              <Text style={styles.sliderText}>
                {formatDuration(progress.seekableDuration)}
              </Text>
            </View>

            <View
              style={[
                styles.audioSubsIconContainer,
                { opacity: videoPressed ? 1 : 0 },
              ]}
            >
              {isMute ? (
                <TouchableOpacity onPress={() => handleVolumeUp()}>
                  <IonIcon name="volume-mute" size={30} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleMute()}>
                  <IonIcon name="volume-high" size={30} color="white" />
                </TouchableOpacity>
              )}

              {resizeMode === 'cover' ? (
                <TouchableOpacity onPress={() => handleZoomIn()}>
                  <Image
                    source={require('../assests/exit-fullscreen.png')}
                    style={styles.zoomIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleZoomOut()}>
                  <Image
                    source={require('../assests/fullscreen.png')}
                    style={styles.zoomIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundVideo: {},
  videoWrapper: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoscreenContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
  },
  iconButton: {
    padding: 10,
  },
  controlIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  controlIconLarge: {
    width: 50,
    height: 50,
    tintColor: 'white',
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  zoomIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  sliderContainer: {
    width: '90%',
    height: '25%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
  sliderProgressBar: {
    flex: 1,
    color: 'red',
    bottom: 40,
  },
  sliderText: {
    color: 'white',
    bottom: 40,
  },
  audioSubsIconContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  audioSubText: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButtonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  movieTitleText: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});
