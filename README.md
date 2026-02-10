# OAUTH + GOOGLE + EXPO

https://www.youtube.com/watch?v=V2YdhR1hVNw&t=510s

## 1. DEPENDENCIES

```bash
npx expo install expo-auth-session expo-crypto
```

```bash
npx expo install expo-secure-store
```

```bash
npm i jose
```

## 2. App.json setting

```bash
code app.json
```

```json
{
  "expo": {
    "scheme": "expooauth",
    /* ... */
    "ios": {
      /* ... */
      "bundleIdentifier": "com.expooauth"
    },
    "android": {
      /* ... */
      "package": "com.expooauth"
    },
    "web": {
      "output": "server"
      /* ... */
    }
    /* ... */
  }
}
```

## 3. CREATE GOOGLE PROJECT & CLIENT

- [Google console](https://console.cloud.google.com/)

- Create new project

- Create OAuth Consent Screen (External Audience)

- Create OAuth Client
  - Application Type: Web Application

  - Authorized Javascript Origin: http://localhost:8081

  - Authorized Redirect URI: http://localhost:8081/api/auth/callback

- Save Client ID & Client Secret

## 4. ENVIRONMENT VARIABLES

```bash
code .env.local
```

```env
GOOGLE_CLIENT_ID=******
GOOGLE_CLIENT_SECRET=******

EXPO_PUBLIC_BASE_URL=http://localhost:8081
EXPO_PUBLIC_SCHEME=expooauth://

JWT_SECRET=******
JWT_REFRESH_SECRET=******
```

## 5. APP PREBUILD

```bash
code .gitignore
```

```
<!-- ... -->
/ios
/android
<!-- ... -->
```

```bash
npx expo prebuild
```

```bash
npx expo run:ios
```

(Video step)
