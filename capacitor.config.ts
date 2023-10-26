import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ivivu.oliviaapp2019',
  appName: 'iVIVU.com',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  cordova: {
    preferences: {
      APP_ID: "628025334278848",
      APP_NAME: "iVIVU.com"
    }
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 10000,
      launchAutoHide: false
    }
  },
};

export default config;
