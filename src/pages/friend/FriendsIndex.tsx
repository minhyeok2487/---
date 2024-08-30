import { FormControlLabel, Switch } from "@mui/material";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { HiUserRemove } from "@react-icons/all-files/hi/HiUserRemove";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { RiArrowLeftRightLine } from "@react-icons/all-files/ri/RiArrowLeftRightLine";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { RAID_SORT_ORDER } from "@core/constants";
import useHandleFriendRequest from "@core/hooks/mutations/friend/useHandleFriendRequest";
import useRemoveFriend from "@core/hooks/mutations/friend/useRemoveFriend";
import useUpdateFriendSetting from "@core/hooks/mutations/friend/useUpdateFriendSetting";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useFriends from "@core/hooks/queries/friend/useFriends";
import useModalState from "@core/hooks/useModalState";
import type { FriendSettings } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { calculateFriendRaids } from "@core/utils/todo.util";

import Button from "@components/Button";
import Modal from "@components/Modal";

import AddFriendButton from "./components/AddFriendButton";

const TABLE_COLUMNS = ["닉네임", "권한", "삭제", ...RAID_SORT_ORDER] as const;

const options: { label: string; key: keyof FriendSettings }[] = [
  {
    label: "일일 숙제 출력 권한",
    key: "showDayTodo",
  },
  {
    label: "일일 숙제 체크 권한",
    key: "checkDayTodo",
  },
  {
    label: "레이드 출력 권한",
    key: "showRaid",
  },
  {
    label: "레이드 체크 권한",
    key: "checkRaid",
  },
  {
    label: "주간 숙제 출력 권한",
    key: "showWeekTodo",
  },
  {
    label: "주간 숙제 체크 권한",
    key: "checkWeekTodo",
  },
  {
    label: "설정 변경 권한",
    key: "setting",
  },
];

const FriendsIndex = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [sortMode, setSortMode] = useState(false);

  const [modalState, setModalState] = useModalState<number>();
  const getFriends = useFriends();
  const getCharacters = useCharacters();

  const handleFriendRequest = useHandleFriendRequest({
    onSuccess: () => {
      toast("요청이 정상적으로 처리되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });
  const updateFriendSetting = useUpdateFriendSetting({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });
  const removeFriend = useRemoveFriend({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
      toast.success("깐부를 삭제했습니다.");
    },
  });

  const targetState = modalState
    ? getFriends.data?.find((friend) => friend.friendId === modalState)
    : undefined;

  if (!getFriends.data || !getCharacters.data) {
    return null;
  }

  const characterRaid = calculateFriendRaids(getCharacters.data);

  return (
    <DefaultLayout pageTitle="깐부리스트">
      <Buttons>
        <AddFriendButton buttonCss={buttonCss} />

        <Button
          css={buttonCss}
          startIcon={sortMode ? <MdSave /> : <RiArrowLeftRightLine />}
          variant="outlined"
          onClick={() => {
            if (sortMode) {
              setSortMode(false);
            }

            setSortMode(true);
          }}
        >
          깐부 순서 {sortMode ? "저장" : "변경"}
        </Button>
      </Buttons>

      {getFriends.data
        .filter((friend) => friend.areWeFriend !== "깐부")
        .map((friend) => (
          <Wrapper key={friend.friendId}>
            <FriendRequestRow>
              <strong>{friend.nickName}</strong> {friend.areWeFriend}
              {friend.areWeFriend === "깐부 요청 받음" && (
                <>
                  <Button
                    variant="contained"
                    color={theme.palette.primary.main}
                    onClick={() => {
                      handleFriendRequest.mutate({
                        fromUsername: friend.friendUsername,
                        action: "ok",
                      });
                    }}
                  >
                    수락
                  </Button>
                  <Button
                    variant="contained"
                    color={theme.palette.error.main}
                    onClick={() => {
                      if (
                        window.confirm(
                          `${friend.nickName}님의 깐부 요청을 거절하시겠습니까?`
                        )
                      ) {
                        handleFriendRequest.mutate({
                          fromUsername: friend.friendUsername,
                          action: "reject",
                        });
                      }
                    }}
                  >
                    거절
                  </Button>
                </>
              )}
              {friend.areWeFriend !== "깐부 요청 받음" && (
                <Button
                  variant="contained"
                  color={theme.palette.error.main}
                  onClick={() => {
                    if (window.confirm("해당 요청을 삭제 하시겠습니까?")) {
                      handleFriendRequest.mutate({
                        fromUsername: friend.friendUsername,
                        action: "delete",
                      });
                    }
                  }}
                >
                  요청 삭제
                </Button>
              )}
            </FriendRequestRow>
          </Wrapper>
        ))}

      <Wrapper>
        <TableScrollWrapper>
          <Table>
            <TitleRow>
              {TABLE_COLUMNS.map((column, index) => {
                const width = (() => {
                  switch (index) {
                    case 0:
                      return 200;
                    case 1:
                    case 2:
                      return 60;
                    default:
                      return 120;
                  }
                })();

                return (
                  <Cell key={index} $width={width}>
                    {column}
                  </Cell>
                );
              })}
            </TitleRow>
            <FriendRow>
              <Cell $width={200}>
                <Link to="/todo">나</Link>
              </Cell>
              <Cell $width={60} />
              <Cell $width={60} />
              {characterRaid?.map((raid) => {
                return (
                  <Cell key={raid.name}>
                    {raid.totalCount > 0 && (
                      <dl>
                        <dt>
                          <em>{raid.count}</em> / {raid.totalCount}
                        </dt>
                        <dd>
                          딜{raid.dealerCount} 폿{raid.supportCount}
                        </dd>
                      </dl>
                    )}
                  </Cell>
                );
              })}
            </FriendRow>
          </Table>

          <Table>
            <tbody>
              {getFriends.data
                .filter((friend) => friend.areWeFriend === "깐부")
                .map((friend) => {
                  const raidStatus = calculateFriendRaids(friend.characterList);

                  return (
                    <tr key={friend.friendId}>
                      <td>
                        <Link to={`/friends/${friend.nickName}`}>
                          {friend.nickName}
                        </Link>
                      </td>
                      <td>
                        <Button
                          variant="icon"
                          onClick={() => setModalState(friend.friendId)}
                        >
                          <AiOutlineSetting size={20} />
                          <span className="text-hidden">깐부 설정</span>
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="icon"
                          onClick={() => {
                            if (
                              window.confirm(
                                `${friend.nickName}님과 깐부를 해제하시겠어요?`
                              )
                            ) {
                              removeFriend.mutate(friend.friendId);
                            }
                          }}
                        >
                          <HiUserRemove size={20} />
                          <span className="text-hidden">깐부 삭제</span>
                        </Button>
                      </td>
                      {raidStatus.map((raid, colIndex) => (
                        <td key={raid.name}>
                          {raid.totalCount > 0 && (
                            <dl>
                              <dt>
                                <em>{raid.count}</em> / {raid.totalCount}
                              </dt>
                              <dd>
                                딜{raid.dealerCount} 폿{raid.supportCount}
                              </dd>
                            </dl>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </TableScrollWrapper>
      </Wrapper>

      {modalState && targetState && (
        <Modal
          title={`${targetState.nickName} 권한 설정`}
          isOpen
          onClose={() => setModalState()}
        >
          <SettingWrapper>
            {options.map((item) => (
              <li key={item.key}>
                {item.label} :{" "}
                <FormControlLabel
                  control={
                    <Switch
                      id={item.key}
                      onChange={(_, checked) => {
                        updateFriendSetting.mutate({
                          id: targetState.friendId,
                          name: item.key,
                          value: checked,
                        });
                      }}
                      checked={targetState.toFriendSettings[item.key]}
                    />
                  }
                  label=""
                />
              </li>
            ))}
          </SettingWrapper>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default FriendsIndex;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  gap: 10px;

  ${({ theme }) => theme.medias.max900} {
    justify-content: center;
  }
`;

const buttonCss = css`
  padding: 8px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 10px;
`;

const Wrapper = styled.div`
  margin-top: 16px;
  padding: 24px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
`;

const FriendRequestRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  margin: -10px 0;

  strong {
    margin-right: 5px;
    font-weight: 700;
  }

  button {
    margin-left: 10px;
  }

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    gap: 6px;
  }
`;

const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.div`
  font-size: 16px;

  ${({ theme }) => theme.medias.max900} {
    font-size: 14px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  background: ${({ theme }) => theme.app.palette.gray[900]};
  color: ${({ theme }) => theme.app.palette.gray[0]};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const FriendRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 57px;
  color: ${({ theme }) => theme.app.text.main};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

const Cell = styled.div<{ $width?: number }>`
  width: ${({ $width }) => $width || 120}px;

  a {
    border-bottom: 1px solid ${({ theme }) => theme.app.text.main};

    &:hover {
      font-weight: 600;
    }
  }

  dl {
    dd {
      font-size: 14px;
      color: ${({ theme }) => theme.app.text.light2};
    }
    dt {
      color: ${({ theme }) => theme.app.text.light2};

      em {
        color: ${({ theme }) => theme.app.text.dark2};
      }
    }
  }
`;

const SettingWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
`;
