import LabelStatus from "components/Label/LabelStatus";
import { ActionDelete, ActionEdit, ActionView } from "components/action";
import Button from "components/button";
import { Dropdown } from "components/dropdown";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postStatus, userRole } from "utils/constants";

const PostManage = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      let res = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(res);
    }
    getData();
  }, []);
  const [selectCategory, setSelectCategory] = useState("");

  const handleClickOption = async (item) => {
    setSelectCategory(item);
  };
  const [totalCate, setTotalCate] = useState();
  const fetch = async (colRef, filter = "", CATEGORY_PER_PAGE = 1) => {
    const newRef = filter
      ? query(
          colRef,
          where("title", ">=", filter),
          where("title", "<=", filter + "utf8")
        )
      : query(colRef, limit(CATEGORY_PER_PAGE));
    const docSnap = await getDocs(newRef);
    const lastVi = docSnap.docs[docSnap.docs.length - 1];
    onSnapshot(newRef, (snapShot) => {
      const res = [];
      snapShot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList(res);
    });
    setLastDoc(lastVi);
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      onSnapshot(colRef, (snapShot) => {
        setTotal(snapShot.size);
      });
      if (selectCategory && !filter) {
        const category = selectCategory?.name;
        const newRefCate = query(colRef, where("categoryName", "==", category));
        onSnapshot(newRefCate, (snapShot) => {
          setTotalCate(snapShot.size);
        });
        fetch(newRefCate, filter, totalCate);
      } else if (selectCategory && filter) {
        const category = selectCategory?.name;
        const newRefCate = query(colRef, where("categoryName", "==", category));
        const newRefCateFilter = query(
          newRefCate,
          where("title", ">=", filter),
          where("title", "<=", filter + "utf8")
        );
        fetch(newRefCateFilter, filter, totalCate);
      } else {
        fetch(colRef, filter);
      }
    }
    fetchData();
  }, [filter, selectCategory, selectCategory?.name, totalCate]);

  const [lastDoc, setLastDoc] = useState();
  const handleLoadmore = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(lastDoc || 0),
      limit(1)
    );
    onSnapshot(nextRef, (snapShot) => {
      const res = [];
      snapShot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList([...postList, ...res]);
    });
    const docSnap = await getDocs(nextRef);
    const lastVi = docSnap.docs[docSnap.docs.length - 1];
    setLastDoc(lastVi);
  };
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const handleDelete = (itemId) => {
    const colRef = doc(db, "posts", itemId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const renderPostStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Approved</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case postStatus.REJECTED:
        return <LabelStatus type="danger">Rejected</LabelStatus>;
      default:
        break;
    }
  };
  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading
        title="Manage post"
        desc="Manage All Posts"
      ></DashboardHeading>

      <div className="flex justify-end mb-10 h-[58px]">
        <div className="w-full max-w-[200px] mr-5 ">
          <Dropdown>
            <Dropdown.Select
              className="h-[58px]"
              placeholder={selectCategory || "Select category"}
            ></Dropdown.Select>
            <Dropdown.List>
              {categories.length > 0 &&
                categories.map((item) => (
                  <Dropdown.Option
                    onClick={() => handleClickOption(item)}
                    key={item.id}
                  >
                    {item.name}
                  </Dropdown.Option>
                ))}
            </Dropdown.List>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 border-solid rounded-lg"
            placeholder="Search post..."
            onChange={handleInputFilter}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((post) => (
              <tr key={post.id}>
                <td title={post.id}>{post.id.slice(0, 5) + "..."}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1 min-w-[300px] whitespace-pre-wrap">
                      <h3 className="font-semibold">{post.title}</h3>
                      <time className="text-sm text-gray-500">
                        {new Date(
                          post.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{post.category.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{post.user.username}</span>
                </td>
                <td>{renderPostStatus(post.status)}</td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ActionView
                      onClick={() => navigate(`/${post.slug}`)}
                    ></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${post.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDelete(post.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > postList.length && !filter && !selectCategory && (
        <div className="mt-10">
          <Button
            type="button"
            kind="primary"
            className="mx-auto"
            onClick={handleLoadmore}
            style={{ display: "flex" }}
          >
            LoadMore
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostManage;
