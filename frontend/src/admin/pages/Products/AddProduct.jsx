import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddProduct = ({ editId, setShowModal, fetchProducts }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [desc, setDesc] = useState("");
  const [cate, setCate] = useState("");
  const [img, setImg] = useState(null);
  const [oldImg, setOldImg] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // 🔹 Loading state
  const [cooldown, setCooldown] = useState(false); // 🔹 Cooldown to prevent multiple clicks

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch single product if editing
  const fetchSingle = async () => {
    if (!editId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/get/product/${editId}`
      );
      setName(res.data.name);
      setPrice(res.data.price);
      setStock(res.data.stock);
      setDesc(res.data.desc);
      setCate(res.data.cate);
      setOldImg(res.data.img);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSingle();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (cooldown) return; // Prevent multiple submissions
  //   setLoading(true);
  //   setCooldown(true);

  //   const fd = new FormData();
  //   fd.append("name", name);
  //   fd.append("price", price);
  //   fd.append("stock", stock);
  //   fd.append("desc", desc);
  //   fd.append("cate", cate);
  //   if (img) fd.append("img", img);

  //   try {
  //     if (editId) {
  //       await axios.put(
  //         `http://localhost:3000/api/update/product/${editId}`,
  //         fd
  //       );
  //       Swal.fire({
  //         icon: "success",
  //         title: "Updated!",
  //         text: "Product updated successfully",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //     } else {
  //       await axios.post("http://localhost:3000/api/add/product", fd);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Added!",
  //         text: "Product added successfully",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //     }

  //     fetchProducts();
  //     setShowModal(false);
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed!",
  //       text: "Something went wrong",
  //     });
  //   } finally {
  //     setLoading(false);
  //     setTimeout(() => setCooldown(false), 1500); // Cooldown 1.5s
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (cooldown) return; // Prevent multiple submissions
  setLoading(true);
  setCooldown(true);

  const fd = new FormData();
  fd.append("name", name);
  fd.append("price", price);
  fd.append("stock", stock);
  fd.append("desc", desc);
  fd.append("cate", cate);
  if (img) fd.append("img", img);

  try {
    if (editId) {
      await axios.put(
        `http://localhost:3000/api/update/product/${editId}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      await axios.post("http://localhost:3000/api/add/product", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Product added successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    fetchProducts();
    setShowModal(false);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Failed!",
      text: "Something went wrong",
    });
  } finally {
    setLoading(false);
    setTimeout(() => setCooldown(false), 1500); // Cooldown 1.5s
  }
};

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="row">
        {/* Name */}
        <div className="col-md-6 col-12 mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="col-md-6 col-12 mb-3">
          <label>Category</label>
          <select
            className="form-select"
            value={cate}
            onChange={(e) => setCate(e.target.value)}
            required
          >
            <option value="">--Select Category--</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.cateName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mb-3">
        {/* Stock */}
        <div className="col-md-3 col-12">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* Price */}
        <div className="col-md-3 col-12">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Image */}
        <div className="col-md-6 col-12">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
      </div>

      {/* Description */}
      <div className="col-md-12 col-12 mb-3">
        <label>Description</label>
        <textarea
          className="form-control"
          rows="4"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        className={`w-100 btn ${editId ? "btn-warning" : "btn-success"}`}
        disabled={loading || cooldown} // disable during API call
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm me-2"></span>
        ) : null}
        {editId ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;
