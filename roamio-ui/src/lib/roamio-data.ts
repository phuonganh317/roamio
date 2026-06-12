export type LatLon = [number, number];

export type Place = {
  id: string;
  name: string;
  city: string;
  category: string;
  parentCategory: string;
  lat: number;
  lon: number;
  popularity: number;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  tags: string[];
  bestHours: number[];
  rareDrop: boolean;
};

export type Traveler = {
  id: number;
  name: string;
  cluster: string;
  points: number;
  homeCity: string;
  lat: number;
  lon: number;
  preferences: Record<string, number>;
  travelDays: number;
  pace: number;
  lastActiveHours: number;
};

export type ItineraryItem = {
  id: string;
  title: string;
  placeId?: string;
  weight: number;
  done: boolean;
  window: string;
};

export type TripProfile = {
  userId: number;
  city: string;
  budgetUsd: number;
  selectedTags: string[];
  currentLocation: LatLon;
  checkInsToday: number;
  bucketCap: number;
  reviewChars: number;
  photos: number;
  currentHour: number;
  dayOfWeek: number;
};

export const datasetStats = {
  source: "Postgres dump 2026-06-08 plus Intro to AI notebooks",
  users: 1031,
  places: 40560,
  checkIns: 197150,
  clusters: 6,
  tables: ["users", "places", "check_ins", "travel_groups", "group_members"],
};

export const places: Place[] = [
  {
    id: "tokyo-tower",
    name: "Tokyo Tower",
    city: "Tokyo",
    category: "Landmark / Observatory",
    parentCategory: "culture",
    lat: 35.6586,
    lon: 139.7454,
    popularity: 95,
    rating: 4.6,
    priceLevel: 3,
    tags: ["culture", "photo", "nightlife"],
    bestHours: [10, 11, 17, 18, 19],
    rareDrop: true,
  },
  {
    id: "shibuya-crossing",
    name: "Shibuya Crossing",
    city: "Tokyo",
    category: "Attraction / Shopping",
    parentCategory: "shopping",
    lat: 35.6595,
    lon: 139.7005,
    popularity: 98,
    rating: 4.7,
    priceLevel: 1,
    tags: ["shopping", "photo", "nightlife"],
    bestHours: [16, 17, 18, 19, 20],
    rareDrop: true,
  },
  {
    id: "meiji-jingu",
    name: "Meiji Jingu Shrine",
    city: "Tokyo",
    category: "Culture / Park",
    parentCategory: "culture",
    lat: 35.6764,
    lon: 139.6993,
    popularity: 92,
    rating: 4.8,
    priceLevel: 1,
    tags: ["culture", "nature", "photo"],
    bestHours: [8, 9, 10, 15, 16],
    rareDrop: false,
  },
  {
    id: "sensoji-temple",
    name: "Senso-ji Temple",
    city: "Tokyo",
    category: "Historic Temple",
    parentCategory: "culture",
    lat: 35.7148,
    lon: 139.7967,
    popularity: 94,
    rating: 4.7,
    priceLevel: 1,
    tags: ["culture", "history", "shopping", "photo"],
    bestHours: [8, 9, 10, 17],
    rareDrop: true,
  },
  {
    id: "ueno-park",
    name: "Ueno Park",
    city: "Tokyo",
    category: "Park / Museums",
    parentCategory: "nature",
    lat: 35.7156,
    lon: 139.773,
    popularity: 86,
    rating: 4.7,
    priceLevel: 1,
    tags: ["nature", "culture", "photo"],
    bestHours: [9, 10, 14, 15],
    rareDrop: true,
  },
  {
    id: "akihabara-electric-town",
    name: "Akihabara Electric Town",
    city: "Tokyo",
    category: "Electronics / Anime District",
    parentCategory: "shopping",
    lat: 35.6984,
    lon: 139.773,
    popularity: 88,
    rating: 4.5,
    priceLevel: 2,
    tags: ["shopping", "nightlife", "photo"],
    bestHours: [13, 14, 15, 18, 19],
    rareDrop: false,
  },
  {
    id: "tsukiji-outer-market",
    name: "Tsukiji Outer Market",
    city: "Tokyo",
    category: "Food Market",
    parentCategory: "food",
    lat: 35.6655,
    lon: 139.7707,
    popularity: 89,
    rating: 4.5,
    priceLevel: 2,
    tags: ["food", "shopping", "local"],
    bestHours: [7, 8, 9, 10, 11],
    rareDrop: false,
  },
  {
    id: "shinjuku-gyoen",
    name: "Shinjuku Gyoen National Garden",
    city: "Tokyo",
    category: "Garden",
    parentCategory: "nature",
    lat: 35.6852,
    lon: 139.7101,
    popularity: 84,
    rating: 4.7,
    priceLevel: 1,
    tags: ["nature", "photo", "culture"],
    bestHours: [9, 10, 14, 15, 16],
    rareDrop: true,
  },
  {
    id: "omoide-yokocho",
    name: "Omoide Yokocho",
    city: "Tokyo",
    category: "Food Alley",
    parentCategory: "nightlife",
    lat: 35.6938,
    lon: 139.7006,
    popularity: 81,
    rating: 4.4,
    priceLevel: 2,
    tags: ["nightlife", "food", "local", "photo"],
    bestHours: [18, 19, 20, 21, 22],
    rareDrop: false,
  },
];

export const travelers: Traveler[] = [
  {
    id: 822,
    name: "Panh",
    cluster: "urban-food-photo",
    points: 2140,
    homeCity: "Tokyo",
    lat: 35.6618,
    lon: 139.7041,
    preferences: { food: 9, culture: 7, nature: 7, shopping: 4, nightlife: 6 },
    travelDays: 4,
    pace: 3,
    lastActiveHours: 1,
  },
  {
    id: 1701,
    name: "Linh",
    cluster: "urban-food-photo",
    points: 3200,
    homeCity: "Tokyo",
    lat: 35.6718,
    lon: 139.703,
    preferences: { food: 8, culture: 8, nature: 5, shopping: 5, nightlife: 6 },
    travelDays: 3,
    pace: 3,
    lastActiveHours: 2,
  },
  {
    id: 537,
    name: "Minh",
    cluster: "urban-food-photo",
    points: 2900,
    homeCity: "Tokyo",
    lat: 35.6581,
    lon: 139.7017,
    preferences: { food: 9, culture: 6, nature: 5, shopping: 7, nightlife: 4 },
    travelDays: 5,
    pace: 4,
    lastActiveHours: 4,
  },
  {
    id: 1960,
    name: "An",
    cluster: "nature-slow",
    points: 2450,
    homeCity: "Tokyo",
    lat: 35.686,
    lon: 139.7104,
    preferences: { food: 5, culture: 7, nature: 10, shopping: 3, nightlife: 2 },
    travelDays: 6,
    pace: 2,
    lastActiveHours: 13,
  },
  {
    id: 556,
    name: "Khai",
    cluster: "urban-food-photo",
    points: 1800,
    homeCity: "Tokyo",
    lat: 35.699,
    lon: 139.7737,
    preferences: { food: 7, culture: 8, nature: 6, shopping: 4, nightlife: 5 },
    travelDays: 3,
    pace: 3,
    lastActiveHours: 12,
  },
  {
    id: 91,
    name: "Trang",
    cluster: "night-market",
    points: 1600,
    homeCity: "Tokyo",
    lat: 35.6942,
    lon: 139.7001,
    preferences: { food: 8, culture: 4, nature: 3, shopping: 8, nightlife: 8 },
    travelDays: 2,
    pace: 4,
    lastActiveHours: 3,
  },
];

export const activeTrip: TripProfile = {
  userId: 822,
  city: "Tokyo",
  budgetUsd: 65,
  selectedTags: ["food", "photo", "culture"],
  currentLocation: [35.6618, 139.7041],
  checkInsToday: 2,
  bucketCap: 5,
  reviewChars: 138,
  photos: 1,
  currentHour: 18,
  dayOfWeek: 2,
};

export const itinerary: ItineraryItem[] = [
  { id: "t1", title: "Morning reset at Meiji Jingu Shrine", placeId: "meiji-jingu", weight: 2, done: true, window: "08:30" },
  { id: "t2", title: "Street energy and photos at Shibuya Crossing", placeId: "shibuya-crossing", weight: 1, done: true, window: "10:30" },
  { id: "t3", title: "Seafood lunch checkpoint at Tsukiji Outer Market", placeId: "tsukiji-outer-market", weight: 1, done: false, window: "12:30" },
  { id: "t4", title: "Late afternoon observatory stop at Tokyo Tower", placeId: "tokyo-tower", weight: 2, done: false, window: "17:20" },
  { id: "t5", title: "Evening food alley and social lane in Shinjuku", placeId: "omoide-yokocho", weight: 2, done: false, window: "20:00" },
];
