import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import PostItem from "module/post/PostItem";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState({});
  const params = useParams();
  useEffect(() => {
    async function fetchCateInfo() {
      const docRef = query(
        collection(db, "categories"),
        where("slug", "==", params.slug)
      );
      onSnapshot(docRef, (snapshot) => {
        const res = [];
        snapshot.forEach((doc) => {
          res.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategory(res[0]);
      });
    }
    fetchCateInfo();
  }, [params.slug]);
  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("category.slug", "==", params.slug)
      );
      onSnapshot(docRef, (snapshot) => {
        const res = [];
        snapshot.forEach((doc) => {
          res.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(res);
      });
    }
    fetchData();
  }, [params.slug]);
  return (
    <Layout>
      <div className="container mt-10" style={{ marginTop: "60px" }}>
        <Heading>Bài viết {category?.name}</Heading>
        {posts.length > 0 ? (
          <div className="grid-layout grid-layout--primary">
            {posts.length > 0 &&
              posts.map((post) => (
                <PostItem key={post.id} data={post}></PostItem>
              ))}
          </div>
        ) : (
          <div>Không có bài viết nào thuộc chủ đề {category?.name}</div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
