import { GOOGLE_MAPS_API_KEY, WEATHER_API_KEY } from "./api-key";

export const environment = {
  production: true,
  emulatorPorts: {
    auth: 9099,
    functions: 5001,
    firestore: 8080,
    database: 9000,
    storage: 9199,
  },
  weatherAPIKey: WEATHER_API_KEY,
  googleMapsAPIKey: GOOGLE_MAPS_API_KEY,
};
