import Link from "next/link";
import { Pokemon } from "../types";

const PokemonItem: React.FC<{
  forwardRef?: (instance: HTMLParagraphElement) => void;
  pokemon: Pokemon;
}> = ({ pokemon: { name }, forwardRef }) => (
  <Link href={`/${name.toLowerCase()}`}>
    <p ref={forwardRef}>{name}</p>
  </Link>
);

export default PokemonItem;
