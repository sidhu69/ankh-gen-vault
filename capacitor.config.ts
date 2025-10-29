import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.90860aace9984c4a8e5cec57260c10e2',
  appName: 'ankh-gen-vault',
  webDir: 'dist',
  server: {
    url: 'https://90860aac-e998-4c4a-8e5c-ec57260c10e2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
