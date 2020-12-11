import DefaultErrorPage from "next/error";
import Link from "next/link";
import Head from "next/head";

import { CSSProperties, memo, useCallback, useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import DetailSection from "../components/DetailSection";
import TypeSection from "../components/TypeSection";
import Navbar from "../components/Navbar";

import { Pokemon } from "../types";

const POKEMON_DETAIL = gql`
  query getPokemonDetail($name: String) {
    pokemon(name: $name) {
      name
      id
      number
      types
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      resistant
      attacks {
        fast {
          name
          type
        }
        special {
          name
          type
        }
      }
      weaknesses
      fleeRate
      maxCP
      evolutions {
        name
        image
      }
      maxHP
      image
    }
  }
`;

const PokemonDetail: React.FC = memo(() => {
  const [pageWidth, setPageWidth] = useState(0);
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

  useEffect(() => {
    if (typeof window !== undefined) setPageWidth(window.innerWidth);
  }, []);

  if (isLoading)
    return (
      <>
        <Head>
          <title>Loading... | Pokédex</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div style={{ textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </>
    );

  if (error) return <p>{error}</p>;
  if (!pokemon) return <DefaultErrorPage statusCode={404} />;

  const {
    name,
    number,
    types,
    weight: { minimum: minWeight, maximum: maxWeight },
    height: { minimum: minHeight, maximum: maxHeight },
    attacks: { fast: fastAttacks, special: specialAttacks },
    classification,
    resistant,
    image,
    evolutions,
    maxHP,
    maxCP,
    fleeRate,
  } = pokemon;

  const fastAttackList = fastAttacks.map(
    (attack) => `${attack.name} (${attack.type})`
  );

  const specialAttackList = specialAttacks.map(
    (attack) => `${attack.name} (${attack.type})`
  );

  return (
    <>
      <Head>
        <title>{name} | Pokédex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "auto" }}>
        <div style={s.header}>
          <h1>{name}</h1>
          <h1 style={{ color: "gray", marginLeft: 12 }}>{`#${number}`}</h1>
        </div>
        <div style={s.container(pageWidth)}>
          <div style={s.aboutContainer}>
            <img src={image} width="100%" />
            <TypeSection title="Type" types={types} />
            <TypeSection title="Weaknesses" types={resistant} />
            <div style={s.aboutSection}>
              <p style={{ fontWeight: "bold", marginBottom: 8 }}>Evolutions</p>
              {evolutions ? (
                <div style={s.evolutionContainer}>
                  {evolutions.map((evolution) => (
                    <Link href={`/${evolution.name.toLowerCase()}`}>
                      <div style={{ textAlign: "center" }}>
                        <img src={evolution.image} height={100} />
                        <p style={{ fontWeight: "bold", marginTop: 8 }}>
                          {evolution.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
          <div style={s.detailContainer}>
            <div style={s.detailSection}>
              <DetailSection title="Classification" value={classification} />
              <DetailSection title="Max HP" value={maxHP} />
              <DetailSection title="Max CP" value={maxCP} />
              <DetailSection title="Flee Rate" value={fleeRate} />
              <DetailSection
                title="Weight"
                value={`${minWeight} - ${maxWeight}`}
              />
              <DetailSection
                title="Height"
                value={`${minHeight} - ${maxHeight}`}
              />
              <DetailSection title="Fast Attacks" value={fastAttackList} />
              <DetailSection
                title="Special Attacks"
                value={specialAttackList}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

interface Styles {
  aboutContainer: CSSProperties;
  aboutSection: CSSProperties;
  container: (pageWidth: number) => CSSProperties;
  detailContainer: CSSProperties;
  detailSection: CSSProperties;
  evolutionContainer: CSSProperties;
  header: CSSProperties;
}

const s: Styles = {
  aboutContainer: {
    display: "flex",
    flex: 2,
    flexDirection: "column",
    margin: 16,
  },
  aboutSection: {
    marginBottom: 12,
  },
  container: (pageWidth) => ({
    display: "flex",
    flexDirection: pageWidth > 700 ? "row" : "column",
  }),
  detailSection: {
    backgroundColor: "lightgray",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0.5px 2px 8px rgba(0,0,0,0.15)",
  },
  detailContainer: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    margin: 16,
  },
  evolutionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
};

export default PokemonDetail;
