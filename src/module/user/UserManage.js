import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import UserTable from "./UserTable";
import Button from "components/button";
import { useAuth } from "contexts/auth-context";
import { userRole } from "utils/constants";
import NotFoundPage from "pages/NotFoundPage";

const UserManage = () => {
  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) return <NotFoundPage></NotFoundPage>;
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button type="button" kind="primary" to="/manage/add-user">
          Add User
        </Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
