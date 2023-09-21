import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import LabelStatus from "drafts/LabelStatus";
import { db } from "firebase-app/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import PostItem from "module/post/PostItem";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { userRole, userStatus } from "utils/constants";

const AuthorPage = () => {
  const [user, setUser] = useState({});
  const params = useParams();
  const { slug } = params;
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    async function getUser() {
      const docRef = query(
        collection(db, "users"),
        where("username", "==", slug)
      );
      const docSnapshot = await getDocs(docRef);
      const res = [];
      docSnapshot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUser(res[0]);
    }
    getUser();
  }, [slug]);
  const userId = user?.id;
  useEffect(() => {
    async function getPostLists() {
      if (!userId) return;
      const docRef = query(
        collection(db, "posts"),
        where("userId", "==", userId)
      );
      const docSnapshot = await getDocs(docRef);
      const res = [];
      docSnapshot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList(res);
    }
    getPostLists();
  }, [userId]);

  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        break;
    }
  };
  const renderRoleLabel = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MOD:
        return "Mod";
      case userRole.USER:
        return "User";
      default:
        break;
    }
  };
  if (!userId) return null;
  return (
    <Layout>
      <div className="container flex items-center justify-center ">
        <div className="w-full p-4 mt-10 border border-gray-200 rounded-lg">
          <div className="py-6 border-b border-b-gray-200">
            <h1 className="text-lg font-medium text-gray-900">Hồ sơ của tôi</h1>
            <div className="mt-1 text-sm text-gray-700">
              Quản lí thông tin hồ sơ để bảo mật tài khoản
            </div>
          </div>

          <div className="flex items-center w-full mt-5">
            <div className="w-[60%] p-10 border-r ">
              <div className="w-full mt-4">
                <span className="mr-5 capitalize w-[40%]">id : </span>
                <span className="">{user.id}</span>
              </div>
              <div className="w-full mt-4">
                <span className="mr-5 capitalize w-[40%]">fullname : </span>
                <span className="">{user.fullname}</span>
              </div>
              <div className="mt-4">
                <span className="mr-5 capitalize w-[40%]">username : </span>
                <span className="">{user.username}</span>
              </div>
              <div className="mt-4">
                <span className="mr-5 capitalize w-[40%]">email : </span>
                <span className="">{user.email}</span>
              </div>
              <div className="mt-4">
                <span className="mr-5 capitalize w-[40%]">desciption : </span>
                <span className="">{user.description}</span>
              </div>

              <div className="mt-4">
                <span className="mr-5 capitalize w-[40%]">role : </span>
                <span className="">{renderRoleLabel(user.role)}</span>
              </div>
              <div className="mt-4">
                <span className="mr-5 capitalize w-[40%]">status : </span>
                <span className="">{renderLabelStatus(user.status)}</span>
              </div>
            </div>
            <div className="w-[40%] flex items-center justify-center">
              <div className="w-[60%] h-[60%]">
                <img
                  src={user.avatar}
                  alt=""
                  className="object-cover w-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{ marginTop: "60px", marginBottom: "50px" }}
      >
        <Heading>Bài viết của {user.fullname}</Heading>
        {postList.length > 0 ? (
          <div className="grid-layout grid-layout--primary">
            {postList.length > 0 &&
              postList.map((post) => (
                <PostItem key={post.id} data={post}></PostItem>
              ))}
          </div>
        ) : (
          <div>Không có bài viết nào thuộc chủ đề {user.fullname}</div>
        )}
      </div>
    </Layout>
  );
};

export default AuthorPage;
