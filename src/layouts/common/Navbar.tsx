import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useReducer } from "react";
import type { To } from "react-router-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { useMember } from "@core/apis/Member.api";
import * as memberApi from "@core/apis/Member.api";
import { loading } from "@core/atoms/Loading.atom";
import { modalState } from "@core/atoms/Modal.atom";

import Logo from "@components/Logo";
import ToggleTheme from "@components/ToggleTheme";

const leftMenues: Array<{
  to: To;
  title: string;
}> = [
  { to: "/todo", title: "숙제" },
  { to: "/friends", title: "깐부" },
  {
    to: {
      pathname: "/comments",
      search: `?page=1`,
    },
    title: "방명록",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, toggleDrawerOpen] = useReducer((state) => !state, false);
  const [userMenuOpen, toggleUserMenuOpen] = useReducer(
    (state) => !state,
    false
  );
  const [modal, setModal] = useRecoilState(modalState);
  const setLoading = useSetRecoilState(loading);

  const { data: member } = useMember();

  const openDeleteUserCharactersForm = () => {
    const modalTitle = "등록 캐릭터 삭제";
    const modalContent = (
      <div className="delete-user-characters-form">
        <p>정말로 등록된 캐릭터를 삭제하시겠습니까?</p>
        <ul>
          <li>등록된 캐릭터, 숙제, 깐부 데이터가 삭제됩니다.</li>
          <li>코멘트 데이터는 유지됩니다.</li>
        </ul>
        <button type="button" onClick={() => deleteUserCharacters(true)}>
          확인
        </button>
        <button type="button" onClick={() => deleteUserCharacters(false)}>
          취소
        </button>
      </div>
    );

    setModal({
      ...modal,
      openModal: true,
      modalTitle,
      modalContent,
    });
  };

  const deleteUserCharacters = async (state: boolean) => {
    try {
      if (state) {
        setLoading(true);
        const response = await memberApi.deleteUserCharacters();
        if (response) {
          alert(response.message);
          window.location.href = "/";
        }
      } else {
        setModal({ ...modal, openModal: false });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <LeftGroup>
        <Logo isDarkMode />
        <LeftMenuBox>
          {leftMenues.map((item) => {
            return (
              <li key={item.title}>
                <LeftMenuItem
                  to={item.to}
                  isActive={
                    location.pathname ===
                    (typeof item.to === "string" ? item.to : item.to.pathname)
                  }
                >
                  {item.title}
                </LeftMenuItem>
              </li>
            );
          })}
        </LeftMenuBox>
      </LeftGroup>

      <RightGroup>
        <ToggleTheme />
        {member?.username ? (
          <AbsoluteMenuWrapper forMobile={false}>
            <Username type="button" onClick={toggleUserMenuOpen}>
              {member?.username}
            </Username>

            {userMenuOpen && (
              <MenuBox>
                <li>
                  <Link to="/member/apikey">
                    <span>API Key 변경</span>
                  </Link>
                </li>
                <li>
                  <button type="button" onClick={openDeleteUserCharactersForm}>
                    <span>등록 캐릭터 삭제</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate("/logout")}>
                    <span>로그아웃</span>
                  </button>
                </li>
              </MenuBox>
            )}
          </AbsoluteMenuWrapper>
        ) : (
          <LoginButton to="/login">로그인</LoginButton>
        )}

        <AbsoluteMenuWrapper forMobile>
          <MobileDrawerButton type="button" onClick={toggleDrawerOpen}>
            {drawerOpen ? (
              <CloseIcon sx={{ fontSize: 30 }} />
            ) : (
              <MenuIcon sx={{ fontSize: 30 }} />
            )}
          </MobileDrawerButton>

          {drawerOpen && (
            <MenuBox>
              <li>
                <Link to="/todo">
                  <span>숙제</span>
                </Link>
              </li>
              <li>
                <Link to="/friends">
                  <span>깐부</span>
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: "/comments",
                    search: `?page=1`,
                  }}
                >
                  <span>방명록</span>
                </Link>
              </li>
              <li>
                {member?.username ? (
                  <UserMenuInDrawer>
                    <div className="username">{member?.username}</div>
                    <ul>
                      <li>
                        <Link
                          style={{ fontWeight: "normal" }}
                          to="/member/apikey"
                        >
                          <span>API Key 변경</span>
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={openDeleteUserCharactersForm}
                        >
                          <span>등록 캐릭터 삭제</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => navigate("/logout")}
                        >
                          <span>로그아웃</span>
                        </button>
                      </li>
                    </ul>
                  </UserMenuInDrawer>
                ) : (
                  <Link to="/login">로그인</Link>
                )}
              </li>
            </MenuBox>
          )}
        </AbsoluteMenuWrapper>
      </RightGroup>
    </Wrapper>
  );
};

export default Navbar;

const Wrapper = styled.header`
  z-index: 4;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 32px;
  width: 100%;
  height: 60px;
  box-shadow: 0px 0px 20px 7px rgba(0, 0, 0, 0.03);
  background: ${({ theme }) => theme.app.semiBlack};
`;

const LeftGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;

  .component-logo {
    width: 140px;
  }
`;

const LeftMenuBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  color: ${({ theme }) => theme.app.white};

  ${({ theme }) => theme.medias.max900} {
    display: none;
  }
`;

const LeftMenuItem = styled(NavLink)<{ isActive: boolean }>`
  line-height: 1px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  border-bottom: 1px solid
    ${({ theme, isActive }) => (isActive ? theme.app.white : "transparent")};
  font-size: 18px;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.app.white};
  }
`;

const RightGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const AbsoluteMenuWrapper = styled.div<{ forMobile: boolean }>`
  position: relative;

  ${({ forMobile, theme }) =>
    forMobile
      ? `
        display:none;

        ${theme.medias.max900}{
          display: block;
        }
      `
      : `
        display:block;

        ${theme.medias.max900}{
          display: none;
        }
      `}
`;

const Username = styled.button`
  color: ${({ theme }) => theme.app.white};
`;

const MenuBox = styled.ul`
  z-index: 99;
  padding: 5px 24px;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(calc(100% + 30px));
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
  background: ${({ theme }) => theme.app.white};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};

  & li a,
  & li button {
    display: block;
    padding: 7px 0;
    width: 100%;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 22px;
    text-align: center;

    &:hover {
      span {
        border-bottom: 1px solid ${({ theme }) => theme.app.text.dark2};
      }
    }
  }
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 0.2rem;
  color: ${({ theme }) => theme.app.white};

  ${({ theme }) => theme.medias.max900} {
    display: none;
  }
`;

const MobileDrawerButton = styled.button`
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;

  ${({ theme }) => theme.medias.max900} {
    display: flex;
  }
`;

const UserMenuInDrawer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.app.border};

  .username {
    margin-bottom: 10px;
  }
`;