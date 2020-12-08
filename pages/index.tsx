import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";

import { Pokemon } from "../types";

const getPokemons = (n: number) => gql`
  query getPokemons {
    pokemons(first: ${n}) {
      name
      id
      number
      types
    }
  }
`;

const PokemonItem: React.FC<{
  forwardRef?: (instance: HTMLParagraphElement) => void;
  pokemon: Pokemon;
}> = ({ pokemon: { name }, forwardRef }) => {
  return <p ref={forwardRef}>{name}</p>;
};

const Home: React.FC = () => {
  const [first, setFirst] = useState(45);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const { loading, data } = useQuery<{ pokemons: Pokemon[] }>(
    getPokemons(first)
  );

  const observer = useRef<IntersectionObserver>();

  const lastRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((items) => {
        if (items[0].isIntersecting) {
          setFirst((prev) => prev + 15);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, observer]
  );

  useEffect(() => {
    if (data?.pokemons && !loading)
      setPokemonList([
        ...pokemonList,
        ...data.pokemons.slice(pokemonList.length),
      ]);
  }, [data, loading]);

  return (
    <>
      <Head>
        <title>Home | Pokédex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {pokemonList.map((pokemon, i) =>
        i === pokemonList.length - 1 ? (
          <PokemonItem
            key={pokemon.number}
            forwardRef={lastRef}
            pokemon={pokemon}
          />
        ) : (
          <PokemonItem key={pokemon.number} pokemon={pokemon} />
        )
      )}
      {loading && <p>Loading...</p>}
    </>
  );
};

export default Home;
