export const res404: HttpResponse = {
  status: 404,
  message: "Resource does not exist",
};

export const res503: HttpResponse = {
  status: 503,
  message:
    "Jikan API failed to connect to MyAnimeList. MyAnimeList may be down/unavailable or refuses to connect. You can try again after 5 seconds",
};

export interface HttpResponse {
  status: number;
  message: string;
}
const Fetcher = async <T>(url: string): Promise<T> => {
  const res: Response = await fetch(url);
  if (res.status === 404) {
    throw res404;
  } else if (res.status === 503) {
    throw res503;
  }
  return res.json();
};

export default Fetcher;
