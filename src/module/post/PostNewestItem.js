import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import slugify from "slugify";
const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      border-radius: 12px;
    }
    &-category {
      margin-bottom: 8px;
    }
    &-title {
      margin-bottom: 8px;
    }
  }
`;
const PostNewestItem = ({ data }) => {
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  if (!data) return null;
  return (
    <PostNewestItemStyles>
      <PostImage to={`${data.slug}`} url={data.image} alt=""></PostImage>

      <div className="post-content">
        <PostCategory type="secondary" to={`${data.category.slug}`}>
          {data.categoryName}
        </PostCategory>
        <PostTitle to={`${data.slug}`} size="normal">
          {data.title}
        </PostTitle>
        <PostMeta
          to={`author/${slugify(data.user?.username || "", { lower: true })}`}
          authorName={data.user?.username}
          date={formatDate || ""}
        ></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;