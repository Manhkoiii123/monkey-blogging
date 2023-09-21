import LabelStatus from "components/Label/LabelStatus";
import { ActionDelete, ActionEdit, ActionView } from "components/action";
import Button from "components/button";
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
import NotFoundPage from "pages/NotFoundPage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { categoryStatus, userRole } from "utils/constants";

const CATEGORY_PER_PAGE = 2;

const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(0);

  const handleDeleteCategory = async (itemId) => {
    const colRef = doc(db, "categories", itemId);
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

  const [lastDoc, setLastDoc] = useState();

  const handleLoadmoreCategory = async () => {
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDoc || 0),
      limit(CATEGORY_PER_PAGE)
    );
    onSnapshot(nextRef, (snapShot) => {
      let res = [];
      snapShot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryList([...categoryList, ...res]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const newRef = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "utf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapShot) => {
        let res = [];
        snapShot.forEach((doc) => {
          res.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(res);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  // update
  const nav = useNavigate();
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) return <NotFoundPage></NotFoundPage>;
  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button type="button" to="/manage/add-category" kind="primary">
          Create Category
        </Button>
      </DashboardHeading>
      <div className="flex justify-end mb-10 rounded-lg outline-none">
        <input
          className="px-5 py-4 border border-gray-300 rounded-lg "
          type="text"
          onChange={handleInputFilter}
          placeholder="Search Category"
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.slug}</td>
                <td>
                  {Number(item.status) === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {Number(item.status) === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">UnApproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView
                      onClick={() => nav(`/category/${item.slug}`)}
                    ></ActionView>
                    <ActionEdit
                      onClick={() =>
                        nav(`/manage/update-category?id=${item.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > categoryList.length && (
        <div className="mt-10">
          <Button
            kind="primary"
            className="mx-auto"
            onClick={handleLoadmoreCategory}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
