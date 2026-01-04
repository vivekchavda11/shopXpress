import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditUser = ({ editId, setShowModal, refresh }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (editId) fetchSingle();
  }, [editId]);

  const fetchSingle = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/get/user/${editId}`);

      setForm({
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/api/update/user/${editId}`,
        form
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      refresh();
      setShowModal(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Unable to update user.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label>Role</label>
        <select
          className="form-select"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button className="btn btn-warning w-100">Update User</button>
    </form>
  );
};

export default EditUser;
