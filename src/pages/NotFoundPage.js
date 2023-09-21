import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
const NotFoundPageStyles = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .logo {
    display: inline-block;
    margin-bottom: 40px;
  }
  .heading {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .back {
    display: inline-block;
    padding: 15px 30px;
    color: white;
    background-color: ${(props) => props.theme.primary};
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
  }
`;
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <NotFoundPageStyles>
      <NavLink to="/" className={"logo"}>
        <img srcSet="/logo.png 2x" alt="monkey-blogging" />
      </NavLink>
      <h1 className="heading">Oops! Page not found</h1>
      <button onClick={() => navigate("/")} className="back">
        Go back
      </button>
    </NotFoundPageStyles>
  );
};

export default NotFoundPage;
