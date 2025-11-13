import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [query, setGuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSearch = async (query: string) => {
    setGuery(query);
    setCurrentPage(1);
  };

  const handleClick = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster />

      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid onSelect={handleClick} movies={data.results} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}

export default App;
