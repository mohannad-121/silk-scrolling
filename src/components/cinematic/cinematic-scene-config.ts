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
  | "massage"
  | "jacuzziEntry"
  | "jacuzzi"
  | "hairRoom"
  | "hairStyle"
  | "hairFinish";
export type RoomEntrance = "street" | "glass" | "arch" | "nail" | "curtain" | "water" | "hair";
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
    alt: "Wide dusk street with the entire ELAN salon storefront and entrance",
    focal: "50% 54%",
    entrance: "street",
    start: 0,
  },
  {
    id: "approach",
    image: exteriorClose,
    alt: "ELAN facade and glass entrance as the visitor approaches from the pavement",
    focal: "49% 54%",
    entrance: "street",
    start: 0.1,
  },
  {
    id: "entrance",
    image: "/cinematic/reception/reception-corridor.png",
    alt: "View through the opening ELAN glass doors into the warm reception",
    focal: "52% 52%",
    entrance: "glass",
    start: 0.2,
  },
  {
    id: "reception",
    image: "/cinematic/reception/reception-corridor.png",
    alt: "Reception desk and the arched corridor leading toward the treatment rooms",
    focal: "58% 52%",
    entrance: "arch",
    start: 0.29,
  },
  {
    id: "manicure",
    image: "/cinematic/manicure/atelier-wide.png",
    alt: "Luxury manicure atelier with polished nail stations and warm lighting",
    focal: "55% 52%",
    entrance: "arch",
    start: 0.39,
  },
  {
    id: "artist",
    image: nailArtist,
    alt: "Nail technician refining a manicure with precise professional technique",
    focal: "56% 50%",
    entrance: "nail",
    start: 0.49,
  },
  {
    id: "nailReveal",
    image: artist,
    alt: "Detailed finished luxury manicure close-up",
    focal: "55% 49%",
    entrance: "nail",
    start: 0.59,
  },
  {
    id: "massage",
    image: "/images/salon-scroll/massage-room-wide.png",
    alt: "Private massage room reached through burgundy curtains and a cream stone arch",
    focal: "52% 54%",
    entrance: "arch",
    start: 0.68,
  },
  {
    id: "jacuzziEntry",
    image: "/cinematic/jacuzzi/jacuzzi-threshold.png",
    alt: "Parted velvet curtains reveal the private candlelit jacuzzi suite",
    focal: "51% 52%",
    entrance: "curtain",
    start: 0.76,
  },
  {
    id: "jacuzzi",
    image: "/cinematic/jacuzzi/private-jacuzzi.png",
    alt: "Private ELAN jacuzzi suite with warm water, reflections and candlelight",
    focal: "52% 54%",
    entrance: "water",
    start: 0.82,
  },
  {
    id: "hairRoom",
    image: "/images/salon-scroll/hair-room-wide.png",
    alt: "Luxury hair styling suite viewed from its arched entrance",
    focal: "58% 52%",
    entrance: "hair",
    start: 0.89,
  },
  {
    id: "hairStyle",
    image: "/images/salon-scroll/hair-styling-medium.png",
    alt: "Professional hairstylist blow-drying and brushing a client’s hair",
    focal: "57% 51%",
    entrance: "hair",
    start: 0.94,
  },
  {
    id: "hairFinish",
    image: "/images/salon-scroll/hair-finish-close.png",
    alt: "Detailed final styling pass through smooth healthy hair",
    focal: "60% 52%",
    entrance: "hair",
    start: 0.98,
  },
];
export const firstCinematicAssets = cinematicRooms.slice(0, 3).map((room) => room.image);
export const cinematicTiming = {
  streetApproach: 0.1,
  mainEntrance: 0.2,
  reception: 0.29,
  manicureEntry: 0.39,
  nailArtist: 0.49,
  nailReveal: 0.59,
  massageEntry: 0.68,
  jacuzziThreshold: 0.76,
  jacuzziEntry: 0.82,
  hairEntry: 0.89,
  hairStyle: 0.94,
  hairFinish: 0.98,
} as const;
