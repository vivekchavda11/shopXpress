import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  handleAddToCart,
  id,
  img,
  title,
  price,
  rating,
  btn,
  viewMore,
}) => {
  return (
    <>
      <div className="col-lg-3 gx-3 gy-3">
        <div className="card h-100 d-flex" style={{ minHeight: "450px" }}>
          <img
            src={"http://localhost:3000" + img}
            className="card-img-top img-fluid"
            alt="Products"
            style={{
              height: "300px",
              width: "300px",
              objectFit: "cover",
              margin: "auto",
              paddingTop: "6px",
            }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{title}</h5>
            <p className="card-text mb-0">Price : {price}</p>
            <p className="card-text">Rating : {rating}</p>
          </div>
          <div className="shop-btns mb-3">
            <div className="container">
              <div className="row g-2">
                {/* g-2 adds gap between columns */}
                <div className="col-6">
                  {/* <Link href="#" className="btn btn-primary w-100 mt-auto"> */}
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary w-100 mt-auto"
                  >
                    Add to Cart
                  </button>

                  {/* </Link> */}
                </div>
                <div className="col-6">
                  <Link to={`/products/${id}`} className="btn btn-dark w-100">
                    {viewMore}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
