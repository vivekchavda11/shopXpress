import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3" style={{ width: "240px", minHeight: "100vh" }}>
      <h4 className="mb-4">Admin Panel</h4>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link to="/admin" className="nav-link text-white">
            <i className="bi bi-speedometer2"></i> Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/products" className="nav-link text-white">
            <i className="bi bi-bag"></i> Products
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/categories" className="nav-link text-white">
            <i className="bi bi-grid"></i> Category
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/orders" className="nav-link text-white">
            <i className="bi bi-receipt"></i> Orders
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/users" className="nav-link text-white">
            <i className="bi bi-people"></i> Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
