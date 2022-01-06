const API_KEY = process.env.NASA_API_KEY;
const PAGE_SIZE = 3;
const START_DATE = new Date();

function subDays(start: Date, days: number): Date {
  const result = new Date(start);
  result.setDate(result.getDate() - days);
  return result;
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getKey(
  pageIndex: number,
  previousPageData: PostInfo[]
): string | null {
  if (previousPageData && !previousPageData.length) return null;

  console.log(API_KEY);
  const endDate = subDays(
    START_DATE,
    pageIndex * PAGE_SIZE + (pageIndex === 0 ? 0 : 1)
  );
  const startDate = subDays(endDate, PAGE_SIZE);
  return `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${toISODate(
    startDate
  )}&end_date=${toISODate(endDate)}&thumbs=True`;
}

/**
 * A post from the Image of the Day NASA API
 */
export interface PostInfo {
  date: Date;
  explanation: string;
  imageUrl: string;
  title: string;
}

export interface ApiError {
  code: number;
  msg: string;
  service_version: string;
}

export class FetchError extends Error {
  info: ApiError[];
  status: number;

  constructor(message: string, info: ApiError[], status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export async function postsFetcher(url: string): Promise<PostInfo[]> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new FetchError(
      "Failed to fetch data.",
      await res.json(),
      res.status
    );
    throw error;
  }
  const json = await res.json();
  const posts = json.map((post: any) => ({
    date: post.date ? new Date(post.date) : new Date(),
    explanation: post.explanation,
    imageUrl: post.media_type === "image" ? post.url : post.thumbnail_url,
    title: post.title,
  }));
  posts.reverse();
  return posts;
}
