import LoadingSpinner from "components/Loading";
import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
const ButtonStyle = styled.button`
  cursor: pointer;
  padding: 0 25px;
  line-height: 1;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  /* width: 100%; */
  font-size: 18px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height || "66px"};

  &:disabled {
    opacity: 0.8;
    pointer-events: none;
  }
  ${(props) =>
    props.kind === "secondary" &&
    css`
      background-color: #fff;
      color: ${(props) => props.theme.primary};
    `};
  ${(props) =>
    props.kind === "primary" &&
    css`
      color: white;
      background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
      );
    `};
`;
/**
 *
 * @param {string} type
 * @returns
 */
const Button = ({
  type = "button",
  onClick = () => {},
  children,
  kind = "secondary",
  ...props
}) => {
  const { isLoading, to, className } = props;
  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to}>
        <ButtonStyle
          className={className}
          type={type}
          kind={kind}
          onClick={onClick}
          {...props}
        >
          {child}
        </ButtonStyle>
      </NavLink>
    );
  }
  return (
    <ButtonStyle
      className={className}
      type={type}
      onClick={onClick}
      kind={kind}
      {...props}
    >
      {child}
    </ButtonStyle>
  );
};
Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  kind: PropTypes.oneOf(["primary", "secondary"]),
};
export default Button;
