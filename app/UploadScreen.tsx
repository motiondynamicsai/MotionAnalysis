import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Image, Animated, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function UploadScreen() {
  const [fileNames, setFileNames] = useState<string[]>([]); // Store multiple file names
  const [fileUris, setFileUris] = useState<string[]>([]); // Store multiple file URIs
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Function to select multiple files (images/videos)
  const selectFiles = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'video/*'],
        multiple: true, // Enable multiple file selection
      });

      if (res.assets && res.assets.length > 0) {
        const newFileNames = res.assets.map((file) => file.name);
        const newFileUris = res.assets.map((file) => file.uri);

        // Append the new files to the existing files
        setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);
        setFileUris((prevFileUris) => [...prevFileUris, ...newFileUris]);
      }
    } catch (err) {
      console.log('DocumentPicker error:', err);
    }
  };

  // Function to analyze the selected files by sending them to the backend server
  const analyseFiles = async (mode: string) => {
    if (fileUris.length === 0) return;

    try {
      for (let i = 0; i < fileUris.length; i++) {
        const fileUri = fileUris[i];
        const fileName = fileNames[i];

        // Fetch the file as a blob
        const response = await fetch(fileUri);
        if (!response.ok) {
          throw new Error('Failed to fetch the file blob');
        }
        const blob = await response.blob();

        // Create form data and append the file and mode
        const formData = new FormData();
        formData.append('file', blob, fileName);
        formData.append('mode', mode);

        // Send the file to the backend server
        const uploadResponse = await fetch('http://mody:8000/process3toDB/', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (uploadResponse.ok) {
          const responseText = await uploadResponse.text();
          const data = responseText ? JSON.parse(responseText) : {};
          console.log(data);
          setUploadMessage('Successfully uploaded');

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }).start(() => setUploadMessage(null));
            }, 2000);
          });
        } else {
          const errorText = await uploadResponse.text();
          console.error('Upload error response:', errorText);
          Alert.alert('Error', `Failed to upload the file: ${errorText || 'Unknown error'}`);
          setUploadMessage(null);
        }
      }
    } catch (err) {
      console.error('Error during file upload:', err);
      Alert.alert('Error', 'An error occurred while uploading the files.');
      setUploadMessage(null);
    }
  };

  // Function to remove all files from the state
  const removeAllFiles = () => {
    setFileNames([]); // Clear all file names
    setFileUris([]);  // Clear all file URIs
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Upload Files</ThemedText>
      <TouchableOpacity style={styles.button} onPress={selectFiles}>
        <ThemedText style={styles.buttonText}>Select Images/Videos</ThemedText>
      </TouchableOpacity>

      <ScrollView style={styles.fileList}>
        {fileNames.map((fileName, index) => (
          <View key={index} style={styles.fileItem}>
            <ThemedText style={styles.fileName}>Selected file: {fileName}</ThemedText>
            {fileUris[index] && fileName.match(/\.(jpg|jpeg|png|gif)$/i) && (
              <Image source={{ uri: fileUris[index] }} style={styles.imagePreview} />
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: fileUris.length ? '#0a7ea4' : '#cccccc' }]}
        onPress={() => analyseFiles('wholebody')}
        disabled={fileUris.length === 0}
      >
        <ThemedText style={styles.buttonText}>Analyse Wholebody</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: fileUris.length ? '#0a7ea4' : '#cccccc', marginTop: 10 }]}
        onPress={() => analyseFiles('pose3d')}
        disabled={fileUris.length === 0}
      >
        <ThemedText style={styles.buttonText}>Analyse Pose3D</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: fileUris.length ? '#ff4c4c' : '#cccccc', marginTop: 10 }]}
        onPress={removeAllFiles}
        disabled={fileUris.length === 0}
      >
        <ThemedText style={styles.buttonText}>Remove All Files</ThemedText>
      </TouchableOpacity>

      {uploadMessage && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <ThemedText style={styles.successMessage}>{uploadMessage}</ThemedText>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  fileList: {
    width: '100%',
    marginTop: 20,
  },
  fileItem: {
    marginBottom: 10,
  },
  fileName: {
    marginBottom: 5,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 5,
    borderRadius: 10,
  },
  successMessage: {
    marginTop: 20,
    color: 'green',
    fontSize: 16,
  },
});
