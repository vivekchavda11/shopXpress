import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditUser from "./EditUser";

const UserList = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/users");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:3000/api/delete/user/${id}`
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.data.message,
            timer: 2000,
            showConfirmButton: false,
          });

          fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Unable to delete category.",
          });
        }
      }
    });
  };

  return (
    <div>
      <h3 className="mb-3">Users</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th className="badge-col text-center">Role</th>
              <th width="150" className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((u) => (
              <tr key={u._id}>
                <td style={{ width: "55px" }}>{u._id}</td>
                <td style={{ width: "220px" }}>{u.username}</td>
                <td>{u.email}</td>

                <td className="badge-col">
                  <span
                    style={{ width: "80px" }}
                    className={`badge ${
                      u.role === "user" ? "bg-primary" : "bg-success"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="text-center">
                  {/* EDIT BUTTON */}
                  <div
                    className="icon-btn edit-btn me-2"
                    onClick={() => {
                      setEditId(u._id);  // FIXED
                      setShowModal(true);
                    }}
                    title="Edit User"
                  >
                    <i className="bi bi-pencil"></i>
                  </div>

                  {/* DELETE BUTTON */}
                  <div
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(u._id)}
                    title="Delete User"
                  >
                    <i className="bi bi-trash"></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT USER MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-warning text-white">
                <h5 className="mb-0">Edit User</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <EditUser
                  editId={editId}
                  setShowModal={setShowModal}
                  refresh={fetchUsers}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserList;
