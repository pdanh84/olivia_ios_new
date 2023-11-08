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
    },
    Badge: {
      persist: true,
      autoClear: false,
    },
    BackgroundRunner: {
      label: 'com.capacitor.background.check',
      src: 'runners/runner.js',
      event: 'paymentcheck',
      repeat: true,
      interval: 30,
      autoStart: true,
    },
  },
};

export default config;
