import artist from "@/assets/scene-artist.jpg";
import exterior from "@/assets/scene-exterior.jpg";
import interior from "@/assets/scene-interior.jpg";
import manicure from "@/assets/scene-manicure.jpg";
import pedicure from "@/assets/scene-pedicure.jpg";

export type SceneId =
  "street" | "reception" | "manicure" | "look" | "pedicure" | "laser" | "jacuzzi";
export type CinematicSceneConfig = { id: SceneId; image: string; alt: string; focal: string };

export const cinematicScenes: CinematicSceneConfig[] = [
  { id: "street", image: exterior, alt: "ELAN salon exterior at dusk", focal: "47% 50%" },
  { id: "reception", image: interior, alt: "ELAN reception beyond the entrance", focal: "54% 50%" },
  {
    id: "manicure",
    image: manicure,
    alt: "Nail artist at work in the ELAN atelier",
    focal: "58% 50%",
  },
  { id: "look", image: artist, alt: "Finished manicure in warm light", focal: "55% 48%" },
  { id: "pedicure", image: pedicure, alt: "Luxury pedicure lounge", focal: "54% 50%" },
  {
    id: "laser",
    image: "/cinematic/laser/laser-suite.png",
    alt: "Private luxury laser suite",
    focal: "52% 50%",
  },
  {
    id: "jacuzzi",
    image: "/cinematic/jacuzzi/private-jacuzzi.png",
    alt: "Private candlelit jacuzzi suite",
    focal: "52% 50%",
  },
];

export const firstCinematicAssets = cinematicScenes.slice(0, 3).map((scene) => scene.image);
