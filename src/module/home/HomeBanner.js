import Button from "components/button";
import React from "react";
import styled from "styled-components";
const HomeBannerStyles = styled.div`
  min-height: 520px;
  padding: 40px 0;
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  margin-bottom: 60px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .banner-content {
    max-width: 600px;
    color: #fff;
  }
  .banner-heading {
    font-size: 36px;
    margin-bottom: 20px;
  }
  .banner-desc {
    line-height: 1.75;
    margin-bottom: 40px;
  }
`;
const HomeBanner = () => {
  return (
    <HomeBannerStyles>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heading">Monkey Blogging</h1>
            <p className="banner-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
              dignissimos vitae praesentium quam architecto cumque eos iste quas
              itaque quaerat?
            </p>
            <Button to="/sign-up" kind="secondary" type="button">
              Get Started
            </Button>
          </div>
          <div className="banner-image">
            <img src="/img-banner.png" alt="" />
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
