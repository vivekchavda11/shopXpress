import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("username")
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  }
  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand mb-0 h4">Admin Dashboard</span>
      <span className="navbar-brand mb-0 h4 ms-auto">Welcome {user}</span>

      <button className="btn btn-outline-danger" onClick={handleLogOut}>
        <i className="bi bi-box-arrow-right"></i> Logout
      </button>
    </nav>
  );
};

export default Header;
