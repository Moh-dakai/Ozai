import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Decode token payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", payload.id);
      localStorage.setItem("userName", payload.name);

      navigate("/myblogs"); // redirect to My Blogs
    } else {
      navigate("/"); // failed login
    }
  }, [navigate]);

  return <p>Authenticating...</p>;
};

export default AuthHandler;
