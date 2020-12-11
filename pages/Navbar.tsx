import { CSSProperties, useCallback, useState } from "react";
import { K_COLOR_BY_TYPES } from "./constants";

interface Props {
  showFilter?: boolean;
  changeFilter?: (type: string) => void;
}

const noop = () => null;

const Navbar: React.FC<Props> = ({
  showFilter = false,
  changeFilter = noop,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = useCallback(() => setIsModalVisible(!isModalVisible), [
    isModalVisible,
  ]);

  const typeOptions = Object.keys(K_COLOR_BY_TYPES);

  const actionChangeFilter = useCallback(
    (type: string) => {
      changeFilter(type);
      setIsModalVisible(false);
    },
    [changeFilter]
  );

  return (
    <>
      <div style={s.container}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <a href="/">
            <img src="/assets/logo.png" alt="Pokédex Logo" height={50} />
          </a>
        </div>
        {showFilter && (
          <a onClick={toggleModal} style={{ position: "absolute", right: 16 }}>
            <img src="/assets/filter.png" alt="Filter" height={32} />
          </a>
        )}
        {isModalVisible && (
          <div style={s.modal}>
            {typeOptions.map((option) => (
              <a
                key={`opt-${option}`}
                onClick={() => actionChangeFilter(option)}
              >
                <div style={{ paddingLeft: 8, paddingRight: 8, width: 200 }}>
                  <p>{option}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 69 }} />
    </>
  );
};

interface Styles {
  container: CSSProperties;
  modal: CSSProperties;
}

const s: Styles = {
  container: {
    padding: "8px 16px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0.5px 2px 8px rgba(0,0,0,0.15)",
    position: "fixed",
    width: "100%",
    backgroundColor: "white",
  },
  modal: {
    position: "absolute",
    right: 16,
    top: 69,
    boxShadow: "0.5px 2px 8px rgba(0,0,0,0.15)",
    backgroundColor: "white",
    zIndex: 2,
  },
};

export default Navbar;
