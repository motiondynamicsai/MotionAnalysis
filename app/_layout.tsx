import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Redirect } from "expo-router";
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './Home';
import UploadScreen from './UploadScreen';
import ProfileScreen from './ProfileScreen';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { signOut } from 'firebase/auth';

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Still determining authentication state
    return null;
  }

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Upload') {
                iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await signOut(auth);
                    router.replace('/login');
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
                style={{ marginRight: 15 }}
              >
                <ThemedText style={{ color: '#0a7ea4' }}>Logout</ThemedText>
              </TouchableOpacity>
            ),
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Tab.Screen name="UploadScreen" component={UploadScreen} options={{ title: 'Upload' }} />
          <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      ) : (
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f', // Deep blue color
  },
});
