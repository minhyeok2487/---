import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { FormControlLabel, Switch } from "@mui/material";
import { AiOutlineDrag } from "@react-icons/all-files/ai/AiOutlineDrag";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { HiUserRemove } from "@react-icons/all-files/hi/HiUserRemove";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { RiArrowLeftRightLine } from "@react-icons/all-files/ri/RiArrowLeftRightLine";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import type { Friend, FriendSettings } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { calculateFriendRaids } from "@core/utils/todo.util";

import Button from "@components/Button";
import Modal from "@components/Modal";

import AddFriendButton from "./components/AddFriendButton";

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

  const [sortMode, setSortMode] = useState(false);
  const [activeId, setActiveId] = useState<number | null>();
  const [sortedFreinds, setSortedFriends] = useState<Friend[]>([]);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) return;

    if (active.id !== over.id) {
      const oldIndex = sortedFreinds.findIndex(
        (el) => el.friendId === active.id
      );
      const newIndex = sortedFreinds.findIndex((el) => el.friendId === over.id);

      const updatedTodoList = arrayMove(sortedFreinds, oldIndex, newIndex);
      setSortedFriends(updatedTodoList);
    }

    setActiveId(undefined);
  };

  useEffect(() => {
    setSortedFriends([...(getFriends.data || [])]);
  }, [sortMode]);

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
            setSortMode(!sortMode);
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
        <Table>
          <NicknameColumn $sortMode={sortMode}>
            <Row>
              {sortMode && <Th $width={50} />}
              <Th $width={200}>닉네임</Th>
            </Row>
            <Row>
              {sortMode && <Td $width={50} />}
              <Td $width={200}>
                <Link to="/todo">나</Link>
              </Td>
            </Row>
            {sortMode ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              ></DndContext>
            ) : (
              getFriends.data
                .filter((friend) => friend.areWeFriend === "깐부")
                .map((friend) => {
                  return (
                    <Row key={friend.friendId}>
                      {sortMode && (
                        <Td $width={50}>
                          <AiOutlineDrag size={20} />
                        </Td>
                      )}
                      <Td $width={200}>
                        <Link to={`/friends/${friend.nickName}`}>
                          {friend.nickName}
                        </Link>
                      </Td>
                    </Row>
                  );
                })
            )}
          </NicknameColumn>
          {!sortMode && (
            <RestColumns>
              <Row>
                <Th $width={60}>권한</Th>
                <Th $width={60}>삭제</Th>
                {RAID_SORT_ORDER.map((column, index) => {
                  return (
                    <Th $width={120} key={index}>
                      {column}
                    </Th>
                  );
                })}
              </Row>
              <Row>
                <Td $width={60} />
                <Td $width={60} />
                {characterRaid?.map((raid) => {
                  return (
                    <Td key={raid.name} $width={120}>
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
                    </Td>
                  );
                })}
              </Row>
              {getFriends.data
                .filter((friend) => friend.areWeFriend === "깐부")
                .map((friend) => {
                  const raidStatus = calculateFriendRaids(friend.characterList);

                  return (
                    <Row key={friend.friendId}>
                      <Td $width={60}>
                        <Button
                          variant="icon"
                          onClick={() => setModalState(friend.friendId)}
                        >
                          <AiOutlineSetting size={20} />
                        </Button>
                      </Td>
                      <Td $width={60}>
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
                        </Button>
                      </Td>
                      {raidStatus.map((raid, colIndex) => (
                        <Td key={raid.name} $width={120}>
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
                        </Td>
                      ))}
                    </Row>
                  );
                })}
            </RestColumns>
          )}
        </Table>
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

const Table = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const NicknameColumn = styled.div<{ $sortMode?: boolean }>`
  ${({ $sortMode }) =>
    !$sortMode &&
    css`
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
    `}

  display: flex;
  flex-direction: column;
`;

const RestColumns = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 200px;
  overflow-x: auto;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

const Th = styled.div<{ $width?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ $width }) => $width}px;
  height: 40px;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  background: ${({ theme }) => theme.app.palette.gray[900]};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
  font-size: 16px;

  ${({ theme }) => theme.medias.max900} {
    font-size: 14px;
  }
`;

const Td = styled(Th)`
  color: ${({ theme }) => theme.app.text.main};
  height: 57px;
  background: ${({ theme }) => theme.app.bg.white};
  border-bottom: 1px solid ${({ theme }) => theme.app.border};

  a {
    border-bottom: 1px solid ${({ theme }) => theme.app.text.main};

    &:hover {
      font-weight: 600;
    }
  }

  dl {
    display: flex;
    flex-direction: column;
    text-align: center;

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
