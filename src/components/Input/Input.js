import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
const InputStyle = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
    background-color: ${(props) => props.theme.grayLight};
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s linear;
    border: 1px solid transparent;
  }
  input::-webkit-input-placeholder {
    color: #b2b3bd;
  }
  input::-moz-input-placeholder {
    color: #b2b3bd;
  }
  input:focus {
    background-color: #fff;
    border-color: ${(props) => props.theme.primary};
  }
  .input-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const Input = ({ name = "", type = "text", children, control, ...props }) => {
  // sử dùng rhf
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    <InputStyle hasIcon={children ? true : false}>
      <input id={name} type={type} {...field} {...props} />
      {children ? <div className="input-icon">{children}</div> : null}
    </InputStyle>
  );
};

export default Input;
