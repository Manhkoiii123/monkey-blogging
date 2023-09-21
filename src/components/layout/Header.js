import Button from "components/button";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const menuLink = [
  {
    url: "/",
    title: "Home",
  },
];
const HeaderStyles = styled.header`
  padding: 15px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }

  .search {
    position: relative;
    margin-left: auto;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
  }
  .search-input {
    flex: 1;
    padding-right: 45px;
    font-weight: 500;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }
  .header-button {
    margin-left: 20px;
  }
  .header-auth {
    margin-left: 20px;
  }
`;

const Header = () => {
  const { userInfo } = useAuth();
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    const colRef = collection(db, "posts");
    const newRef = query(
      colRef,
      where("title", ">=", filter),
      where("title", "<=", filter + "utf8")
    );

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
  }, [filter]);
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img srcSet="/logo.png 2x" alt="monkey blogging" className="logo" />
          </NavLink>
          <ul className="menu">
            {menuLink.map((item) => (
              <li className="menu-item" key={item.title}>
                <NavLink to={item.url}>{item.title}</NavLink>
              </li>
            ))}
          </ul>

          <div className="relative search">
            <input
              type="text"
              className="search-input"
              onChange={handleInputFilter}
              placeholder="Search post..."
            />
            <span className="search-icon">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="7.66669"
                  cy="7.05161"
                  rx="6.66669"
                  ry="6.05161"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
                <path
                  d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {filter && (
              <div className="p-3 absolute w-100% mt-3 top-full left-0 border border-gray-200 bg-white z-10 shadow-md rounded-md">
                {postList.length > 0 &&
                  postList.map((item) => (
                    <div
                      className="flex items-center p-1 mt-3 border-b-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => nav(`/${item.slug}`)}
                    >
                      <div className="w-[40px] h-[40px] mr-5">
                        <img
                          src={item.image}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      </div>

                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        <span className="text-sm font-semibold capitalize">
                          {item.user?.fullname}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {!userInfo ? (
            <Button
              type="button"
              height="45.6px"
              className="header-button"
              to="/sign-up"
              kind="primary"
              style={{
                maxWidth: "180px",
              }}
            >
              Sign Up
            </Button>
          ) : (
            <Button
              to="/dashboard"
              kind="primary"
              height="45.6px"
              className="ml-5"
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
