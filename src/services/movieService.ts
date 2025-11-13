import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieHttpResponse {
  results: Movie[];
  total_page: number;
}

axios.defaults.baseURL = "https://api.themoviedb.org/3/search";
const myApiToken = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieHttpResponse> => {
  const response = await axios.get<MovieHttpResponse>("/movie", {
    params: {
      query: query,
      page: page,
    },
    headers: {
      Authorization: `Bearer ${myApiToken}`,
    },
  });

  // console.log(query);
  // console.log(response.data);
  return response.data;
};
