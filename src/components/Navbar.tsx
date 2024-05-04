import { FC, useState } from "react";
import "../styles/components/Navbar.css";
import Logo from "./Logo";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useMember } from "../apis/Member.api";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);

  const { data:member } = useMember();

  const darkOnOff = () => {};

  const toggleClickEvent = () => {
    const dropDownMenu = document.querySelector(".dropdown_menu");
    dropDownMenu!!.classList.toggle("open");

    const isOpenNow = dropDownMenu!!.classList.contains("open");
    setIsOpen(isOpenNow);
  };

  const handlerDropdownUser = () => {
    setUsernameOpen(!usernameOpen);
  };

  const logout = async () => {
    // try {
    //   const response = await auth.logout();
    //   if (response.success) {
    //     localStorage.removeItem("ACCESS_TOKEN");
    //     localStorage.removeItem("username");
    //     window.location.href = "/";
    //   }
    // } catch (error) {
    //   console.error("Error Logout", error);
    // }
  };

  const location = useLocation();

  return (
    <header>
      <div className="navbar">
        <Logo isDarkMode={true} />
        <ul className="links">
          <li>
            <NavLink
              to="/todo"
              className={location.pathname === "/todo" ? "active" : ""}
            >
              숙제
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/friends"
              className={location.pathname === "/friends" ? "active" : ""}
            >
              깐부
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/comments"
              className={location.pathname === "/comments" ? "active" : ""}
            >
              방명록
            </NavLink>
          </li>
        </ul>

        <div className="menus">
          <input
            className="theme-input"
            type="checkbox"
            id="darkmode-toggle"
            onChange={darkOnOff}
          />
          <label className="theme-label" htmlFor="darkmode-toggle"></label>
          <div className="buttons">
            <div style={{ marginLeft: 10 }}>
              {member?.username === null ? (
                <Link to="/login" className="action_btn">
                  로그인
                </Link>
              ) : (
                <div
                  onClick={() => handlerDropdownUser()}
                  className="login_name"
                >
                  {member?.username}
                </div>
              )}
            </div>
          </div>
          <div className="toggle_btn">
            <div className="icon" onClick={() => toggleClickEvent()}>
              {isOpen ? (
                <CloseIcon sx={{ fontSize: 30 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 30 }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="user_info_wrap">
        {usernameOpen && (
          <div className="user_info">
            <li>
              <Link to="/member/apikey">API Key 변경</Link>
            </li>
            <li>
              <div onClick={() => logout()}>로그아웃</div>
            </li>
          </div>
        )}
      </div>

      <div className="dropdown_menu">
        <li>
          <Link to="/todo">숙제</Link>
        </li>
        <li>
          <Link to="/friends">깐부</Link>
        </li>
        <li>
          <Link to="/comments">방명록</Link>
        </li>
        <li>
          {member?.username === null  ? (
            <Link to="/login" className="action_btn">
              로그인
            </Link>
          ) : (
            <div className="login_box">
              <div className="login_name">{member?.username}</div>
              <Link to="/member/apikey">API Key 변경</Link>
              <div onClick={() => logout()} className="logout_btn">
                로그아웃
              </div>
            </div>
          )}
        </li>
      </div>
    </header>
  );
};

export default Navbar;
