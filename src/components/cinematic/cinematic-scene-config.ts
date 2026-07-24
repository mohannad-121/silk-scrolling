import artist from "@/assets/scene-artist.jpg";
import exteriorClose from "@/assets/scene-exterior.jpg";
import nailArtist from "@/assets/scene-manicure.jpg";

export type CinematicRoomId =
  | "street"
  | "approach"
  | "entrance"
  | "reception"
  | "manicure"
  | "artist"
  | "nailReveal"
  | "jacuzziEntry"
  | "jacuzzi"
  | "massage";

export type RoomEntrance = "street" | "glass" | "arch" | "nail" | "curtain" | "water";

export type CinematicRoomConfig = {
  id: CinematicRoomId;
  image: string;
  alt: string;
  focal: string;
  entrance: RoomEntrance;
  start: number;
};

export const cinematicRooms: CinematicRoomConfig[] = [
  {
    id: "street",
    image: "/cinematic/exterior/street-arrival.png",
    alt: "Wide dusk street with ELAN salon between neighboring boutiques",
    focal: "50% 54%",
    entrance: "street",
    start: 0,
  },
  {
    id: "approach",
    image: exteriorClose,
    alt: "ELAN facade and illuminated entrance as the visitor approaches",
    focal: "49% 54%",
    entrance: "street",
    start: 0.1,
  },
  {
    id: "entrance",
    image: "/cinematic/reception/reception-corridor.png",
    alt: "Reception and a glowing arched path to the manicure atelier",
    focal: "52% 52%",
    entrance: "glass",
    start: 0.19,
  },
  {
    id: "reception",
    image: "/cinematic/reception/reception-corridor.png",
    alt: "ELAN reception with marble desk and manicure-room archway ahead",
    focal: "52% 52%",
    entrance: "arch",
    start: 0.28,
  },
  {
    id: "manicure",
    image: "/cinematic/manicure/atelier-wide.png",
    alt: "Luxury manicure atelier with a curtained spa corridor ahead",
    focal: "55% 52%",
    entrance: "arch",
    start: 0.4,
  },
  {
    id: "artist",
    image: nailArtist,
    alt: "Nail artist refining a manicure in warm studio light",
    focal: "56% 50%",
    entrance: "nail",
    start: 0.5,
  },
  {
    id: "nailReveal",
    image: artist,
    alt: "Finished luxury manicure close-up",
    focal: "55% 49%",
    entrance: "nail",
    start: 0.6,
  },
  {
    id: "jacuzziEntry",
    image: "/cinematic/jacuzzi/jacuzzi-threshold.png",
    alt: "Parted velvet curtains showing a candlelit jacuzzi suite ahead",
    focal: "51% 52%",
    entrance: "curtain",
    start: 0.69,
  },
  {
    id: "jacuzzi",
    image: "/cinematic/jacuzzi/private-jacuzzi.png",
    alt: "Private ELAN jacuzzi suite with warm water and candlelight",
    focal: "52% 54%",
    entrance: "water",
    start: 0.79,
  },
  {
    id: "massage",
    image: "/cinematic/massage/massage-entry.png",
    alt: "Private massage room framed by a warm arched doorway",
    focal: "52% 54%",
    entrance: "arch",
    start: 0.9,
  },
];

export const firstCinematicAssets = cinematicRooms.slice(0, 3).map((room) => room.image);

export const cinematicTiming = {
  streetApproach: 0.1,
  mainEntrance: 0.19,
  reception: 0.28,
  manicureEntry: 0.4,
  nailArtist: 0.5,
  nailReveal: 0.6,
  jacuzziThreshold: 0.69,
  jacuzziEntry: 0.79,
  massageEntry: 0.9,
  finalReserve: 0.965,
} as const;
