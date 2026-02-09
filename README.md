# OAUTH + GOOGLE + EXPO

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

## 2. app.json setting

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
