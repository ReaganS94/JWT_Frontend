import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  // const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("user");
    setUser(null);
    // navigate("/");
  };

  // const user = JSON.parse(localStorage.getItem("user"));

  console.log("USER from navbar", user);

  return (
    <div className="container">
      <div className="title">
        <Link to="/">My Cool Blog</Link>
      </div>
      <nav>
        {user !== null && (
          <div>
            <span>{user.email}</span>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {user === null && (
          <div>
            <Link to="login">Login</Link>
            <Link to="signup">Signup</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
