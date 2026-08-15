# Lifelog

Lifelog is a cross-platform digital journaling application developed as part of a university project.

It allows users to create, view, edit, delete and favourite memories, format their entries using a rich text editor, search by title or creation date, and view basic journaling statistics.

The application is designed for offline use; all data is stored locally on the device.

## Features

- Create, edit, view and delete memories
- Rich text editing
- Automatic saving
- Search by title and creation date
- Favourite memories
- Journaling statistics
- Offline storage

## Technologies

- React Native
- Expo
- TypeScript
- React Native Paper
- React Native Pell Rich Editor
- Zustand
- Expo File System
- Expo Crypto
- Lodash
- Jest

## Requirements

The following are required to run the project:

- Node.js
- npm
- Expo Go, if running the application on a physical device

## Running the Project

Install the dependencies:

```bash
npm install
```

Start the Expo development server:

```
npx expo start
```

The application can then be opened using Expo Go by scanning the QR code.

## Building

Install EAS CLI:

```bash
npm install -g eas-cli
```

Log in and configure EAS:

```bash
eas login
eas build:configure
```

Build for Android:

```bash
eas build --platform android
```

Build for iOS:

```bash
eas build --platform ios
```

## Testing

Run the unit tests with:

```bash
npm run test
```
