import styled from "@emotion/styled";
import { Button as MuiButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/character.api";
import { loading } from "@core/atoms/loading.atom";
import useWeeklyRaids from "@core/hooks/queries/character/useWeeklyRaids";
import useFriendWeeklyRaids from "@core/hooks/queries/friend/useFriendWeeklyRaids";
import type { Character, WeeklyRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  character: Character;
  friend?: Friend;
}

const EditModal = ({ onClose, isOpen, character, friend }: Props) => {
  const queryClient = useQueryClient();
  const setLoadingState = useSetRecoilState(loading);

  const getWeeklyRaids = useWeeklyRaids(
    {
      characterId: character.characterId,
      characterName: character.characterName,
    },
    { enabled: isOpen && !friend }
  );
  const getFriendWeeklyRaids = useFriendWeeklyRaids(
    {
      characterId: character.characterId,
      friendUsername: friend?.friendUsername as string,
    },
    { enabled: isOpen && !!friend }
  );
  const targetData = friend ? getFriendWeeklyRaids : getWeeklyRaids;

  const invalidateData = () => {
    if (friend) {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriendWeeklyRaid({
          characterId: character.characterId,
          friendUsername: friend.friendUsername,
        }),
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getWeeklyRaids({
          characterId: character.characterId,
          characterName: character.characterName,
        }),
      });
    }
  };

  // 골드 획득 캐릭터 지정
  const updateGoldCharacter = async () => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateGoldCharacter(character);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        toast.success(
          `${character.characterName}의 골드 획득 설정을 변경하였습니다.`
        );
        onClose();
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    }
    setLoadingState(false);
  };

  // 골드 체크 방식
  const updateGoldCheckVersion = async () => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateGoldCheckVersion(character);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        toast.success(
          `${character.characterName}의 골드 체크 방식을 변경하였습니다.`
        );
        onClose();
      } catch (error) {
        console.error("Error updateWeekTodo All:", error);
      }
    }
    setLoadingState(false);
  };

  // 컨텐츠 골드 획득 지정
  const updateWeekGoldCheck = async (
    weekCategory: string,
    updateValue: boolean
  ) => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateCheckGold(
          character,
          weekCategory,
          updateValue
        );

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });

        invalidateData();
      } catch (error) {
        console.log(error);
      }
    }
    setLoadingState(false);
  };

  // 캐릭터 주간 숙제 업데이트(추가/삭제)
  const updateWeekTodo = async (todo: WeeklyRaid) => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekTodo(character, todo);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });

        invalidateData();
      } catch (error) {
        console.error("Error updateWeekTodo:", error);
      }
    }
  };

  // 캐릭터 주간 숙제 업데이트 All(추가/삭제)
  const updateWeekTodoAll = async (todos: WeeklyRaid[]) => {
    setLoadingState(true);
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekTodoAll(character, todos);

        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });

        invalidateData();
      } catch (error) {
        console.error("Error updateWeekTodo:", error);
      }
    }
    setLoadingState(false);
  };

  return (
    <Modal
      title={`${character.characterName} 주간 숙제 관리`}
      isOpen={isOpen}
      onClose={onClose}
    >
      {(() => {
        const todosByCategory: {
          [key: string]: {
            노말: WeeklyRaid[];
            하드: WeeklyRaid[];
          };
        } = {};
        const todosGoldCheck: { [key: string]: boolean } = {};

        targetData.data?.forEach((todo) => {
          if (!todosByCategory[todo.weekCategory]) {
            todosByCategory[todo.weekCategory] = {
              노말: [],
              하드: [],
            };
          }
          if (todo.weekContentCategory === "노말") {
            todosByCategory[todo.weekCategory]["노말"].push(todo);
          } else {
            todosByCategory[todo.weekCategory]["하드"].push(todo);
          }
          if (todosGoldCheck[todo.weekCategory] === undefined) {
            todosGoldCheck[todo.weekCategory] = todo.goldCheck;
          } else {
            todosGoldCheck[todo.weekCategory] =
              todosGoldCheck[todo.weekCategory] || todo.goldCheck;
          }
        });

        const content = Object.entries(todosByCategory).map(
          ([weekCategory, todos], index) => {
            return (
              <ContentWrapper key={index}>
                <CategoryRow>
                  <p>{weekCategory}</p>

                  {character.settings.goldCheckVersion &&
                    (todosGoldCheck[weekCategory] ? (
                      <GetGoldButton
                        type="button"
                        onClick={() =>
                          updateWeekGoldCheck(
                            weekCategory,
                            !todosGoldCheck[weekCategory]
                          )
                        }
                      >
                        골드 획득 지정 해제
                      </GetGoldButton>
                    ) : (
                      <GetGoldButton
                        type="button"
                        isActive
                        onClick={() =>
                          updateWeekGoldCheck(
                            weekCategory,
                            !todosGoldCheck[weekCategory]
                          )
                        }
                      >
                        골드 획득 지정
                      </GetGoldButton>
                    ))}
                </CategoryRow>

                <Difficulty>
                  {Object.entries(todos).map(
                    ([weekContentCategory, todo], todoIndex) =>
                      todo.length > 0 && (
                        <GatewayButtons key={todoIndex}>
                          <GatewayHeadButotn
                            key={todoIndex}
                            type="button"
                            onClick={() => updateWeekTodoAll(todo)}
                            isActive={
                              todo.reduce(
                                (count, todoItem) =>
                                  count + (todoItem.checked ? 1 : 0),
                                0
                              ) === todo.length
                            }
                          >
                            <p>
                              <strong>{weekContentCategory}</strong>
                              {todo.reduce(
                                (sum, todoItem) => sum + todoItem.gold,
                                0
                              )}
                              G
                            </p>
                          </GatewayHeadButotn>
                          {todo.map((todoItem) => (
                            <GatewayButton
                              key={todoItem.id}
                              type="button"
                              isActive={todoItem.checked}
                              onClick={() => updateWeekTodo(todoItem)}
                            >
                              <p>
                                <strong>{todoItem.gate}관문</strong>
                                {todoItem.gold}G
                              </p>
                            </GatewayButton>
                          ))}
                        </GatewayButtons>
                      )
                  )}
                </Difficulty>
              </ContentWrapper>
            );
          }
        );

        return (
          <>
            <ModalButtonsWrapper>
              <MuiButton
                variant="contained"
                size="small"
                onClick={() => updateGoldCharacter()}
                style={{ cursor: "pointer" }}
              >
                골드 획득 캐릭터 지정 {character.goldCharacter ? "해제" : ""}
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={() => updateGoldCheckVersion()}
                style={{ cursor: "pointer" }}
              >
                골드 획득 체크 방식 :{" "}
                {character.settings.goldCheckVersion ? "체크 방식" : "상위 3개"}
              </MuiButton>
            </ModalButtonsWrapper>

            {content}
          </>
        );
      })()}
    </Modal>
  );
};

export default EditModal;

const ModalButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 20px;
`;

const CategoryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
`;

const GetGoldButton = styled.button<{ isActive?: boolean }>`
  position: relative;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  color: ${({ theme }) => theme.app.text.main};
  overflow: hidden;

  &:hover::before {
    opacity: 1;
  }

  &::before {
    z-index: -1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ isActive, theme }) =>
      isActive ? theme.app.gold : theme.app.blue3};
    opacity: 0.5;
  }
`;

const Difficulty = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const GatewayButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  & > button {
    flex: 1;
    padding: 5px 0;
    margin-left: -1px;
  }
`;

const GatewayHeadButotn = styled.button<{ isActive?: boolean }>`
  z-index: ${({ isActive }) => (isActive ? 1 : "unset")};
  background: ${({ isActive, theme }) =>
    isActive ? theme.app.blue3 : theme.app.bar.red};
  border: 1px solid
    ${({ isActive, theme }) =>
      isActive ? theme.app.text.black : theme.app.border};
  color: ${({ theme }) => theme.app.semiBlack1};

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 1.2;

    strong {
      font-size: 14px;
      font-weight: ${({ isActive }) => (isActive ? 700 : "unset")};
    }
  }
`;

const GatewayButton = styled.button<{ isActive?: boolean }>`
  z-index: ${({ isActive }) => (isActive ? 1 : "unset")};
  border: 1px solid
    ${({ isActive, theme }) =>
      isActive ? theme.app.text.black : theme.app.border};
  color: ${({ theme }) => theme.app.text.dark2};

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 1.2;

    strong {
      font-size: 14px;
      font-weight: ${({ isActive }) => (isActive ? 700 : "unset")};
    }
  }
`;