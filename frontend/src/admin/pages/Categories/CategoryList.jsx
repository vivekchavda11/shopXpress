import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AddCategory from "./AddCategory";

const CategoryList = () => {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/categories");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `http://localhost:3000/api/delete/category/${id}`
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: res.data.message,
            timer: 1800,
            showConfirmButton: false,
          });

          fetchCategories();
        } catch (err) {
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Categories</h3>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle"></i> Add Category
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "80px" }}>#Category ID</th>
              <th>Category Name</th>
              <th className="text-center" style={{ width: "150px" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((c) => (
              <tr key={c._id}>
                <td>{c._id}</td>
                <td>{c.cateName}</td>

                <td className="text-center">
                  {/* EDIT */}
                  <div
                    className="icon-btn edit-btn me-2"
                    onClick={() => {
                      setEditId(c._id);
                      setShowModal(true);
                    }}
                    title="Edit Category"
                  >
                    <i className="bi bi-pencil"></i>
                  </div>

                  {/* DELETE */}
                  <div
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(c._id)}
                    title="Delete Category"
                  >
                    <i className="bi bi-trash"></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div
                className="modal-header"
                style={{
                  background: editId ? "#ffc107" : "#198754",
                  color: "black",
                }}
              >
                <h4 className="mb-0">
                  {editId ? "Edit Category" : "Add Category"}
                </h4>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body" style={{ padding: "25px" }}>
                <AddCategory
                  id={editId}
                  closeModal={() => setShowModal(false)}
                  fetchCategories={fetchCategories}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
