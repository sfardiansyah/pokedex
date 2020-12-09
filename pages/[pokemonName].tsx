import DefaultErrorPage from "next/error";
import Head from "next/head";

import { useCallback, useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import { Pokemon } from "../types";

const POKEMON_DETAIL = gql`
  query getPokemonDetail($name: String) {
    pokemon(name: $name) {
      name
      id
      number
      types
    }
  }
`;

const PokemonDetail: React.FC = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState<Pokemon | undefined>();
  const {
    query: { pokemonName },
  } = useRouter();

  const client = useApolloClient();

  const loadPokemon = useCallback(
    async (name: string) => {
      try {
        const { data } = await client.query<{ pokemon?: Pokemon }>({
          query: POKEMON_DETAIL,
          variables: {
            name,
          },
        });

        if (data.pokemon) {
          setPokemon(data.pokemon);
        }

        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    },
    [client]
  );

  useEffect(() => {
    if (typeof pokemonName === "string") {
      loadPokemon(pokemonName);
    }
  }, [pokemonName]);

  if (isLoading)
    return (
      <>
        <Head>
          <title>Loading... | Pokédex</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>Loading...</p>
      </>
    );

  if (error) return <p>{error}</p>;
  if (!pokemon) return <DefaultErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{pokemon.name} | Pokédex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>Pokemon: {pokemon.name}</p>
    </>
  );
};

export default PokemonDetail;
