import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fun.zerolight.wordpal',
  appName: 'WordPal-词友',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
