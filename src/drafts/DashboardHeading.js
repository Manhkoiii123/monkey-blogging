import React from "react";
import styled from "styled-components";
const DashboardHeadingStyled = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .dashboard-heading {
    color: black;
    font-size: 36px;
    margin-bottom: 0;
  }
  .dashboard-short-desc {
    opacity: 0.6;
  }
`;
const DashboardHeading = ({ title = "", desc = "", children }) => {
  return (
    <DashboardHeadingStyled>
      <div>
        <h1 className="dashboard-heading">{title}</h1>
        <p className="dashboard-short-desc">{desc}</p>
      </div>
      <div>{children}</div>
    </DashboardHeadingStyled>
  );
};

export default DashboardHeading;
