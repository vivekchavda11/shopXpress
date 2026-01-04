import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddCategory = ({ id, closeModal, fetchCategories }) => {
  const isEdit = Boolean(id);

  const [cateName, setCateName] = useState("");
  const [cateImg, setCateImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // FETCH SINGLE CATEGORY FOR EDIT
  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/get/category/${id}`
      );

      setCateName(res.data.cateName || "");
    } catch (error) {
      console.log("Fetch Category Error:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown) return;

    setLoading(true);
    setCooldown(true);

    const fd = new FormData();
    fd.append("cateName", cateName);
    if (cateImg) fd.append("cateImg", cateImg);

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3000/api/update/category/${id}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Category updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await axios.post(
          "http://localhost:3000/api/add/category",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Category added successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      }

      fetchCategories();
      closeModal();
    } catch (error) {
      console.log("Add/Edit Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label">Category Name:</label>
      <input
        type="text"
        className="form-control mb-3"
        required
        value={cateName}
        onChange={(e) => setCateName(e.target.value)}
      />

      <label className="form-label">Category Image:</label>
      <input
        type="file"
        className="form-control mb-3"
        required={!isEdit}
        onChange={(e) => setCateImg(e.target.files[0])}
      />

      <button
        className={`btn w-100 ${isEdit ? "btn-warning" : "btn-success"}`}
        disabled={loading || cooldown}
        type="submit"
      >
        {loading && (
          <span className="spinner-border spinner-border-sm me-2"></span>
        )}
        {isEdit ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
};

export default AddCategory;
