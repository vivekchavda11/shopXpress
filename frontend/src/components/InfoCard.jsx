import React from "react";

const InfoCard = ({ icon, title, para }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-4 mb-4 info-card-main">
      <div className="info-card text-center p-3 h-100">
        <div className="card-icon-box mb-3 fs-2">
          <i className={icon}></i>
        </div>
        <h3 className="card-text mb-2 fs-5">{title}</h3>
        <p className="mb-0">{para}</p>
      </div>
    </div>
  );
};

export default InfoCard;
