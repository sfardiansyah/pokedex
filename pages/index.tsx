import Head from "next/head";

import { gql, useQuery } from "@apollo/client";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import PokemonItem from "./PokemonItem";
import Navbar from "./Navbar";

import { Pokemon } from "../types";

const POKEMONS = gql`
  query getPokemons($n: Int!) {
    pokemons(first: $n) {
      name
      id
      number
      types
      image
    }
  }
`;

const Home: React.FC = () => {
  const [first, setFirst] = useState(30);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [hasMore, sethasMore] = useState(true);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const { loading, data } = useQuery<{ pokemons: Pokemon[] }>(POKEMONS, {
    variables: { n: first },
  });

  const filteredList = useMemo(
    () =>
      typeFilter
        ? pokemonList.filter(({ types }) => types.includes(typeFilter))
        : pokemonList,
    [pokemonList, typeFilter]
  );

  const observer = useRef<IntersectionObserver>();

  const lastRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((items) => {
        if (items[0].isIntersecting && hasMore) {
          setFirst((prev) => prev + 20);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, observer]
  );

  useEffect(() => {
    if (data?.pokemons && !loading) {
      if (data.pokemons.length === pokemonList.length) {
        sethasMore(false);
      } else {
        setPokemonList([
          ...pokemonList,
          ...data.pokemons.slice(pokemonList.length),
        ]);
      }
    }
  }, [data, loading]);

  return (
    <>
      <Head>
        <title>Home | Pokédex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar showFilter changeFilter={setTypeFilter} />
      <div style={{ padding: "16px 8px" }}>
        <div style={s.listContainer}>
          {filteredList.map((pokemon, i) =>
            i === filteredList.length - 1 ? (
              <PokemonItem
                key={pokemon.number}
                forwardRef={lastRef}
                pokemon={pokemon}
              />
            ) : (
              <PokemonItem key={pokemon.number} pokemon={pokemon} />
            )
          )}
        </div>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </>
  );
};

interface Styles {
  listContainer: CSSProperties;
}

const s: Styles = {
  listContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: "auto",
    maxWidth: 720,
  },
};

export default Home;
