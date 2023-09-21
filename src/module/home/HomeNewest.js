import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import PostNewestItem from "module/post/PostNewestItem";
import PostNewestLarge from "module/post/PostNewestLarge";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 64px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
`;

const HomeNewest = () => {
  const [newPostList, setNewPostList] = useState([]);
  useEffect(() => {
    async function getPostNew() {
      const colRef = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(4)
      );
      onSnapshot(colRef, (snapshot) => {
        const res = [];
        snapshot.forEach((doc) => {
          res.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setNewPostList(res);
      });
    }
    getPostNew();
  }, []);
  const [lagre, ...rest] = newPostList;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Mới nhất</Heading>
        <div className="layout">
          <PostNewestLarge data={lagre}></PostNewestLarge>
          <div className="sidebar">
            {rest.length > 0 &&
              rest.map((item) => (
                <PostNewestItem key={item.id} data={item}></PostNewestItem>
              ))}
          </div>
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
