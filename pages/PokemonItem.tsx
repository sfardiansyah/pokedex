import Link from "next/link";
import { CSSProperties, useEffect, useMemo, useState } from "react";

import { Pokemon } from "../types";
import { K_COLOR_BY_TYPES } from "./constants";

const PokemonItem: React.FC<{
  forwardRef?: (instance: HTMLParagraphElement) => void;
  pokemon: Pokemon;
}> = ({ pokemon: { name, image, number, types }, forwardRef }) => {
  const [pageWidth, setPageWidth] = useState(0);

  const columns = useMemo(() => (pageWidth > 700 ? 7 : 2), [pageWidth]);

  useEffect(() => {
    if (typeof window !== undefined) setPageWidth(window.innerWidth);
  }, []);

  return (
    <Link href={`/${name.toLowerCase()}`}>
      <div style={s.container(pageWidth, columns)}>
        <p style={s.number}>{`#${number}`}</p>
        <div style={{ textAlign: "center" }}>
          <img src={image} style={{ objectFit: "contain", height: 50 }} />
        </div>
        <p ref={forwardRef} style={s.name}>
          {name}
        </p>
        <div style={s.typeList}>
          {types.map((type) => (
            <div style={s.typeContainer(type)}>
              <p style={s.typeText}>{type}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

interface Styles {
  container: (pagewidth: number, columns: number) => CSSProperties;
  name: CSSProperties;
  number: CSSProperties;
  typeContainer: (type: string) => CSSProperties;
  typeList: CSSProperties;
  typeText: CSSProperties;
}

const s: Styles = {
  container: (pageWidth, columns) => ({
    padding: 8,
    margin: 8,
    marginTop: 0,
    borderRadius: 4,
    boxShadow: "0.5px 2px 8px rgba(0,0,0,0.15)",
    width: (pageWidth - 16 * (columns + 1)) / columns,
  }),
  name: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 0,
    marginTop: 16,
    fontWeight: "bold",
  },
  number: {
    textAlign: "right",
    marginTop: 0,
    fontSize: 12,
  },
  typeContainer: (type: string) => ({
    padding: "2px 12px",
    borderRadius: 8,
    marginRight: 4,
    marginTop: 8,
    backgroundColor: K_COLOR_BY_TYPES[type],
  }),
  typeList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  typeText: { margin: 0, fontSize: 11, color: "white" },
};

export default PokemonItem;
