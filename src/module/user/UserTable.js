import LabelStatus from "components/Label/LabelStatus";
import { ActionDelete, ActionEdit } from "components/action";
import Button from "components/button";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { deleteUser } from "firebase/auth";
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
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userRole, userStatus } from "utils/constants";

const UserTable = () => {
  const nav = useNavigate();
  const [userList, setUserList] = useState([]);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState();

  const [lastDoc, setLastDoc] = useState();

  const handleLoadMoreUser = async () => {
    const nextRef = query(
      collection(db, "users"),
      startAfter(lastDoc || 0),
      limit(1)
    );
    onSnapshot(nextRef, (snapShot) => {
      let res = [];
      snapShot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList([...userList, ...res]);
    });
    const docSnap = await getDocs(nextRef);
    const lastVisible = docSnap.docs[docSnap.docs.length - 1];
    setLastDoc(lastVisible);
  };
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "users");
      onSnapshot(colRef, (snapShot) => {
        setTotal(snapShot.size);
      });
      const newRef = filter
        ? query(
            colRef,
            where("fullname", ">=", filter),
            where("fullname", "<=", filter + "utf8")
          )
        : query(colRef, limit(1));
      const docSnap = await getDocs(newRef);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];
      onSnapshot(newRef, (snapShot) => {
        const res = [];
        snapShot.forEach((doc) => {
          res.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUserList(res);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);
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
  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);
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
        // await deleteUser(user);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const handleFilterUser = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  return (
    <div>
      <div className="flex justify-end mb-10">
        <input
          type="text"
          placeholder="Search User"
          className="py-3 border border-gray-300 rounded-lg px-7"
          onChange={handleFilterUser}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id}>
                <td title={user.id}>{user.id.slice(0, 5) + "...."}</td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={user.avatar}
                      alt=""
                      className="flex-shrink-0 object-cover w-10 h-10 rounded-lg"
                    />
                    <div className="flex-1">
                      <h3>{user?.fullname}</h3>
                      <time className="text-sm text-gray-300">
                        {new Date(
                          user?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">{user?.username}</td>
                <td>{user?.email}</td>
                <td>{renderLabelStatus(Number(user?.status))}</td>
                <td>{renderRoleLabel(user.role)}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionEdit
                      onClick={() => nav(`/manage/update-user?id=${user.id}`)}
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteUser(user)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > userList.length && (
        <Button
          className="mx-auto mt-10"
          kind="primary"
          type="button"
          style={{ display: "flex" }}
          onClick={handleLoadMoreUser}
        >
          LoadMore
        </Button>
      )}
    </div>
  );
};

export default UserTable;
