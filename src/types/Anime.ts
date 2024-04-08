import { type Session } from "next-auth";
import { type DateTime, type Linkable } from "./common";
import { type Content, type ContentRelation } from "./Content";
import { type Genre } from "./Genre";
import { type ImageSet } from "./Image";
import { type Studio } from "./Studio";
import { type Video } from "./Video";

export type AnimeId = number;
export type AnimeDuration = "S" | "D" | "F";
export type AnimeStatus = "anons" | "ongoing" | "released";
export type AnimeTopicKind = AnimeStatus | "episode";
export type AnimeRating = "none" | "g" | "pg" | "pg_13" | "r" | "r_plus" | "rx";
export type AnimeKind =
  | "tv"
  | "movie"
  | "ova"
  | "ona"
  | "special"
  | "music"
  | "tv_13"
  | "tv_24"
  | "tv_48";
export type AnimeOrder =
  | "id"
  | "id_desc"
  | "ranked"
  | "kind"
  | "popularity"
  | "name"
  | "aired_on"
  | "episodes"
  | "status"
  | "random"
  | "created_at"
  | "created_at_desc";

export interface Anime extends Content {
  id: AnimeId;
  kind: AnimeKind;
  status: AnimeStatus;
  episodes: number;
  episodes_aired: number;
  rating: AnimeRating;
  genres: Genre<"Anime">[];
  duration: number;
  updated_at: DateTime;
  next_episode_at: number | null;
  fansubbers: string[];
  fandubbers: string[];
  studios: Studio[];
  videos: Video[];
  screenshots: ImageSet[];
}
export type Metadata = {
  totalPages: number;
  hasMore: boolean;
};

export interface AnimeCardProps {
  anime: Anime;
  index: number;
  session: Session | null;
}

/** @interface */
export type AnimeRelation = ContentRelation & Record<"anime", AnimeBasic>;

/** @interface */
export type AnimeBasic = Pick<
  Anime,
  | "id"
  | "name"
  | "russian"
  | "image"
  | "url"
  | "kind"
  | "score"
  | "status"
  | "episodes"
  | "episodes_aired"
  | "aired_on"
  | "released_on"
> &
  Linkable;
