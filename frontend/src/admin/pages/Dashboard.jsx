import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaUsers, FaList, FaShoppingCart } from "react-icons/fa";


const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    users: 0,
    categories: 0,
    orders: 0
  });

  const fetchCounts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/dashboard/counts");
      setCounts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Total Products",
      count: counts.products,
      icon: <FaBox size={35} />,
      color: "primary",
    },
    {
      title: "Total Orders",
      count: counts.orders,
      icon: <FaShoppingCart size={35} />,
      color: "success",
    },
    {
      title: "Total Users",
      count: counts.users,
      icon: <FaUsers size={35} />,
      color: "warning",
    },
    {
      title: "Total Categories",
      count: counts.categories,
      icon: <FaList size={35} />,
      color: "info",
    },
  ];

  return (
    <>
      <h2 className="mb-4 fw-bold">Dashboard</h2>

      <div className="row g-4">
        {cards.map((card, index) => (
          <div className="col-md-3" key={index}>
            <div className="card shadow-sm border-0 rounded-4 p-3 h-100 hover-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">{card.title}</h6>
                  <h3 className="fw-bold mt-2">{card.count}</h3>
                </div>
                <div
                  className={`p-3 rounded-circle bg-${card.color}-subtle text-${card.color}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Add this small hover effect style */}
      <style>{`
        .hover-card {
          transition: transform 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
};

export default Dashboard;
