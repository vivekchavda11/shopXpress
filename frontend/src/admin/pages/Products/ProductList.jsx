import { useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import axios from "axios";
import Swal from "sweetalert2";

const ProductList = () => {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/products");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:3000/api/delete/product/${id}`
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.data.message,
            timer: 2000,
            showConfirmButton: false,
          });

          fetchProducts();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Unable to delete product.",
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products</h3>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle"></i> Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#Product ID</th>
              <th>Name</th>
              <th className="text-center">Price (₹)</th>
              <th className="text-center">Stock</th>
              <th className="text-center" width="150">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td style={{ width: "670px" }}>{p.name}</td>
                <td className="text-center">{p.price}</td>
                <td className="text-center">{p.stock}</td>

                <td className="text-center">
                  <div
                    className="icon-btn edit-btn me-2"
                    onClick={() => {
                      setEditId(p._id);
                      setShowModal(true);
                    }}
                    title="Edit Product"
                  >
                    <i className="bi bi-pencil"></i>
                  </div>

                  <div
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(p._id)}
                    title="Delete Product"
                  >
                    <i className="bi bi-trash"></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div
                className={`modal-header ${
                  editId ? "bg-warning" : "bg-success"
                } text-white`}
              >
                <h5 className="mb-0">
                  {editId ? "Edit Product" : "Add Product"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <AddProduct
                  editId={editId}
                  setShowModal={setShowModal}
                  fetchProducts={fetchProducts}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
