import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;

      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 12px;
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  if (!data) return null;
  return (
    <PostNewestLargeStyles>
      <PostImage to={`${data.slug}`} url={data.image} alt=""></PostImage>
      <PostCategory>
        {data.category.name && (
          <PostCategory to={data.category.slug}>
            {data.category.name}
          </PostCategory>
        )}
      </PostCategory>
      <PostTitle to={`${data.slug}`} size="big">
        {data.title}
      </PostTitle>
      <PostMeta
        to={`author/${slugify(data.user?.username || "", { lower: true })}`}
        authorName={data.user?.username}
        date={formatDate || ""}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
