import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const location = useLocation();

  const getUrlParameter = (name: string): string | null => {
    const search = location.search;
    const params = new URLSearchParams(search);
    return params.get(name);
  };

  const token = getUrlParameter("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return <div />;
};

export default SocialLogin;
