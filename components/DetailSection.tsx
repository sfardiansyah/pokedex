interface Props {
  title: string;
  value: number | string | string[];
}

const DetailSection: React.FC<Props> = ({ title, value }) => (
  <div style={{ display: "flex", flexDirection: "row" }}>
    <p style={{ flex: 2, fontWeight: "bold" }}>{title}</p>
    {Array.isArray(value) ? (
      <div style={{ display: "flex", flex: 3, flexDirection: "row" }}>
        <p>: </p>
        <div style={{ marginLeft: 2 }}>
          {value.map((str) => (
            <p>{str}</p>
          ))}
        </div>
      </div>
    ) : (
      <p style={{ flex: 3 }}>: {value}</p>
    )}
  </div>
);

export default DetailSection;
