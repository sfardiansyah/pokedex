import { CSSProperties } from "react";
import { K_COLOR_BY_TYPES } from "./constants";

interface Props {
  title: string;
  types: string[];
}

const TypeSection: React.FC<Props> = ({ title, types }) => (
  <div style={{ marginBottom: 12 }}>
    <p style={{ fontWeight: "bold", marginBottom: 8 }}>{title}</p>
    <div style={s.values}>
      {types.map((type) => (
        <div key={`${name}-${type}`} style={s.typeItem(type)}>
          <p style={s.typeText}>{type}</p>
        </div>
      ))}
    </div>
  </div>
);

interface Styles {
  typeItem: (type: string) => CSSProperties;
  typeText: CSSProperties;
  values: CSSProperties;
}

const s: Styles = {
  typeItem: (type) => ({
    padding: "4px 16px",
    borderRadius: 8,
    marginRight: 4,
    marginTop: 8,
    backgroundColor: K_COLOR_BY_TYPES[type],
  }),
  typeText: { margin: 0, fontSize: 14, color: "white" },
  values: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
};

export default TypeSection;
