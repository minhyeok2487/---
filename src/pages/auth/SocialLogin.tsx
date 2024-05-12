import { useLocation, useNavigate } from "react-router-dom";
import { useMember } from "../../core/apis/Member.api";
import { useCharacters } from "../../core/apis/Character.api";
import { useFriends } from "../../core/apis/Friend.api";

const SocialLogin = () => {
  const location = useLocation();

  const getUrlParameter = (name: string): string | null => {
    let search = location.search;
    let params = new URLSearchParams(search);
    return params.get(name);
  };

  const token = getUrlParameter("token");

  const { data: member, refetch: refetchMember } = useMember();
  const { data: characters, refetch: refetchCharacters } = useCharacters();
  const { data: friends, refetch: refetchFriends } = useFriends();

  const navigate = useNavigate();


  if (token) {
    localStorage.setItem("ACCESS_TOKEN", token);
    navigate("/");
  } else {
    navigate("/login");
  }
  return <></>;
};

export default SocialLogin;
