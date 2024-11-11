import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View, Button, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import VideoPlayer from '@/components/VideoPlayer';

export default function HomeScreen() {
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [jsonFileIds, setJsonFileIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoAndJsonIds = async () => {
      try {
        const videoResponse = await fetch('http://mody:8000/videos/');
        if (!videoResponse.ok) {
          throw new Error(`HTTP error! status: ${videoResponse.status}`);
        }
        const videoData = await videoResponse.json();
        setVideoIds(videoData);

        // Assuming a similar endpoint for JSON file IDs
        const jsonResponse = await fetch('http://mody:8000/json_ids/');
        if (!jsonResponse.ok) {
          throw new Error(`HTTP error! status: ${jsonResponse.status}`);
        }
        const jsonData = await jsonResponse.json();
        setJsonFileIds(jsonData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching video or JSON IDs:", error);
        setLoading(false);
      }
    };

    fetchVideoAndJsonIds();
  }, []);

  const handleDownload = async (jsonId: string) => {
    try {
      const response = await fetch(`http://mody:8000/download_json/${jsonId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${jsonId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading JSON file:", error);
      Alert.alert("Download Error", "Failed to download the JSON file.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0a7ea4" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>Video Feed</ThemedText>
      </ThemedView>
      {videoIds.map((id, index) => (
        <View key={id} style={styles.videoCard}>
          <VideoPlayer filename={`http://mody:8000/stream_video/${id}`} />
          <ThemedText style={styles.videoDescription}>Video {index + 1}</ThemedText>
          <Button
            title="Download JSON"
            onPress={() => handleDownload(jsonFileIds[index])}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  header: {
    padding: 15,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoCard: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  videoDescription: {
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
});

