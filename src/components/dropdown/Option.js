import React from "react";
import { useDropdown } from "./dropdown-context";

const Option = (props) => {
  const { onClick } = props;
  const { setShow, setLabel } = useDropdown();

  const handleClick = () => {
    onClick && onClick();
    setLabel(props.children);
    setShow(false);
  };
  return (
    <div
      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Option;
