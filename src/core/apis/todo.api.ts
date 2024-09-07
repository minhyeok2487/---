import mainAxios from "@core/apis/mainAxios";
import type { NoDataResponse } from "@core/types/api";
import type { Character } from "@core/types/character";
import type {
  AddCustomTodoRequest,
  CheckCustomTodoRequest,
  CheckDailyTodoRequest,
  CheckRaidTodoRequest,
  CheckWeeklyTodoRequest,
  CustomTodoItem,
  RemoveCustomTodoRequest,
  UpdateCustomTodoRequest,
} from "@core/types/todo";

// 일간 콘테츠 투두
export const checkDailyTodo = ({
  characterId,
  characterName,
  category,
  checkAll,
  isFriend,
}: CheckDailyTodoRequest): Promise<Character> => {
  if (isFriend) {
    return mainAxios
      .patch(
        `/v2/friends/day-content/check/${category}${checkAll ? "/all" : ""}`,
        {
          characterId,
          characterName,
        }
      )
      .then((res) => res.data);
  }

  return mainAxios
    .patch(
      `/v4/character/day-todo/check/${category}${checkAll ? "/all" : ""}`,
      {
        characterId,
        characterName,
      }
    )
    .then((res) => res.data);
};

// 레이드 투두
export const checkRaidTodo = ({
  characterId,
  characterName,
  weekCategory,
  currentGate,
  totalGate,
  checkAll,
  isFriend,
}: CheckRaidTodoRequest): Promise<Character> => {
  if (isFriend) {
    return mainAxios
      .patch(`/v2/friends/raid/check${checkAll ? "/all" : ""}`, {
        characterId,
        characterName,
        weekCategory,
        currentGate,
        totalGate,
      })
      .then((res) => res.data);
  }

  return mainAxios
    .patch(`/v2/character/week/raid/check${checkAll ? "/all" : ""}`, {
      characterId,
      characterName,
      weekCategory,
      currentGate,
      totalGate,
    })
    .then((res) => res.data);
};

// 주간 콘텐츠 투두
export const checkWeeklyTodo = ({
  characterId,
  characterName,
  action,
  isFriend,
}: CheckWeeklyTodoRequest): Promise<Character> => {
  const url = (() => {
    if (isFriend) {
      switch (action) {
        case "UPDATE_WEEKLY_EPONA":
          return "/v2/friends/epona";
        case "UPDATE_WEEKLY_EPONA_ALL":
          return "/v2/friends/epona/all";
        case "TOGGLE_SILMAEL_EXCHANGE":
          return "/v2/friends/silmael";
        case "SUBSCTRACT_CUBE_TICKET":
          return "/v2/friends/cube/substract";
        case "ADD_CUBE_TICKET":
          return "/v2/friends/cube/add";
        default:
          return "/v2/friends/epona";
      }
    } else {
      switch (action) {
        case "UPDATE_WEEKLY_EPONA":
          return "/v2/character/week/epona";
        case "UPDATE_WEEKLY_EPONA_ALL":
          return "/v2/character/week/epona/all";
        case "TOGGLE_SILMAEL_EXCHANGE":
          return "/v2/character/week/silmael";
        case "SUBSCTRACT_CUBE_TICKET":
          return "/v2/character/week/cube/substract";
        case "ADD_CUBE_TICKET":
          return "/v2/character/week/cube/add";
        default:
          return "/v2/character/week/epona";
      }
    }
  })();

  return mainAxios
    .patch(url, {
      id: characterId,
      characterName,
    })
    .then((res) => res.data);
};

// 커스텀 투두
export const getCustomTodos = (
  friendUsername?: string
): Promise<CustomTodoItem[]> => {
  if (friendUsername) {
    return mainAxios
      .get(`/v4/friends/custom/${friendUsername}`)
      .then((res) => res.data);
  }

  return mainAxios.get("/v4/custom").then((res) => res.data);
};

export const addCustomTodo = ({
  friendUsername,
  characterId,
  contentName,
  frequency,
}: AddCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.post(`/v4/friends/custom/${friendUsername}`, {
      characterId,
      contentName,
      frequency,
    });
  }

  return mainAxios.post("/v4/custom", { characterId, contentName, frequency });
};

export const checkCustomTodo = ({
  friendUsername,
  characterId,
  customTodoId,
}: CheckCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.post(`/v4/friends/custom/${friendUsername}/check`, {
      characterId,
      customTodoId,
    });
  }

  return mainAxios.post("/v4/custom/check", { characterId, customTodoId });
};

export const updateCustomTodo = ({
  friendUsername,
  customTodoId,
  characterId,
  contentName,
}: UpdateCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.patch(
      `/v4/friends/custom/${friendUsername}/${customTodoId}`,
      {
        characterId,
        contentName,
      }
    );
  }

  return mainAxios.patch(`/v4/custom/${customTodoId}`, {
    characterId,
    contentName,
  });
};

export const removeCustomtodo = ({
  friendUsername,
  customTodoId,
}: RemoveCustomTodoRequest): Promise<NoDataResponse> => {
  if (friendUsername) {
    return mainAxios.delete(
      `/v4/friends/custom/${friendUsername}/${customTodoId}`
    );
  }

  return mainAxios.delete(`/v4/custom/${customTodoId}`);
};
