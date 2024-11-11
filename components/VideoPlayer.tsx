import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const VideoPlayer = ({ filename }: { filename: string }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.videoContainer}>
        <video
          src={filename}
          className="video-element"
          controls
          style={styles.videoElement}
        />
      </View>
    );
  } else {
    const Video = require('react-native-video').default;
    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: filename }}
          style={styles.videoElement}
          controls
          resizeMode="contain"
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  videoElement: {
    width: width,
    height: height * 0.5,
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

export default VideoPlayer; 