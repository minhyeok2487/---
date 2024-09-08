import type { Character } from "@core/types/character";

export interface HandleFriendRequest {
  fromUsername: string;
  action: HandleFriendRequestAction;
}

export interface UpdateFriendSettingRequest {
  id: number;
  name: keyof FriendSettings;
  value: boolean;
}

export interface UpdateFriendTodoRaidListRequest {
  friendCharacterId: number;
  friendUsername: string;
  weekContentIdList: number[];
}

export interface Friend {
  friendId: number;
  friendUsername: string;
  areWeFriend: AreWeFriend;
  nickName: string;
  characterList: Character[];
  toFriendSettings: FriendSettings;
  fromFriendSettings: FriendSettings;
}

export interface FriendSettings {
  showDayTodo: boolean; // 일일 숙제 출력 권한
  checkDayTodo: boolean; // 일일 숙제 체크 권한
  showRaid: boolean; // 주간 레이드 숙제 권한
  checkRaid: boolean; // 주간 레이드 체크 권한
  showWeekTodo: boolean; // 주간 숙제 출력 권한
  checkWeekTodo: boolean; // 주간 숙제 출력 권한
  updateGauge: boolean; //
  updateRaid: boolean;
  setting: boolean;
}

export interface SearchCharacterItem {
  id: number;
  areWeFriend: AreWeFriend;
  characterListSize: number;
  characterName: string;
  username: string;
}

export type AreWeFriend =
  | "깐부 요청" // 친구가 아닌 상태
  | "깐부" // 이미 친구임
  | "깐부 요청 진행중" // 내가 친구 요청을 보낸 상태
  | "깐부 요청 받음" // 나한테 친구 요청이 온 상태
  | "요청 거부"; // 내가 거부했거나 거부 당함

export type HandleFriendRequestAction = "ok" | "delete" | "reject";
