export type Theme = "light" | "dark";

export type PageGuardRules =
  | "ONLY_AUTH_USER" // 로그인 상태일 때만 접근 가능
  | "ONLY_GUEST" // 로그인 안한 유저만 접근 가능
  | "ONLY_CHARACTERS_REGISTERED_USER" // 캐릭터를 등록한 유저만 접근 가능
  | "ONLY_NO_CHARACTERS_USER"; // 캐릭터를 등록하지 않은 유저만 접근 가능
