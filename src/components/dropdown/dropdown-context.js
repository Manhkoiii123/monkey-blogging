import { createContext, useContext, useState } from "react";

const DropdownContext = createContext();
function DropdownProvider(props) {
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState("");
  const toggle = () => {
    setShow(!show);
  };
  const values = { show, setShow, toggle, label, setLabel };
  return (
    <DropdownContext.Provider value={values}>
      {props.children}
    </DropdownContext.Provider>
  );
}
function useDropdown() {
  const context = useContext(DropdownContext);
  if (typeof context === "undefined")
    throw new Error("useDropdown must be used within DropdownProvider");
  return context;
}
export { useDropdown, DropdownProvider };
