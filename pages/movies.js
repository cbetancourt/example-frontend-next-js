import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import sanity from "../lib/sanity";
import listStyles from "../styles/list";
import imageUrlBuilder from "@sanity/image-url";

const imageBuilder = imageUrlBuilder(sanity);

const imageUrlFor = source => imageBuilder.image(source);

const query = `*[_type == "movie"] {
  _id,
  title,
  releaseDate,
  poster,
  "posterAspect": poster.asset->.metadata.dimensions.aspectRatio,
  "director": crewMembers[job == "Director"][0].person->name
}[0...50]
`;

const Movies = ({ movies }) => (
  <Layout>
    <div className="movies">
      <ul className="list">
        {movies.map(movie => (
          <li key={movie._id} className="list__item">
            <Link href="/movie/[id]" as={`/movie/${movie._id}`}>
              <a>
                {movie.poster && (
                  <img
                    src={imageUrlFor(movie.poster)
                      .ignoreImageParams()
                      .width(300)}
                    width="100"
                    height={100 / movie.posterAspect}
                  />
                )}
                <div style={{ paddingTop: "0.5em" }}>
                  {movie.releaseDate}
                </div>
                <h3>{movie.title}</h3>
                {movie.director && (
                  <span className="movies-list__directed-by">
                    Directed by {movie.director}
                  </span>
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <style jsx>{`
      .movies {
        padding: 1rem;
      }
      .movies-list__directed-by {
        display: block;
        font-size: 1rem;
      }
    `}</style>
    <style jsx>{listStyles}</style>
  </Layout>
)

Movies.getInitialProps = async () => ({
  movies: await sanity.fetch(query)
});

export default Movies;
