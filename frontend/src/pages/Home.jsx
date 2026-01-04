import Banner from "../components/Banner";
import InfoCard from "../components/InfoCard";
const Home = () => {
  return (
    <>

    
      {/* Banner */}
      <section className="banner">
        <Banner />
      </section>

      {/* InfoCard */}
      <section className="bg-light">
        <div className="container">
          <div className="row">
            <InfoCard
              icon={"fa-solid fa-truck"}
              title={"Free Shipping"}
              para={
                "Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra."
              }
            />

            <InfoCard
              icon={"fa-solid fa-piggy-bank"}
              title={"Money Back Gurantee"}
              para={
                "Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra."
              }
            />

            <InfoCard
              icon={"fa-solid fa-percent"}
              title={"Discount Offers"}
              para={
                "Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra."
              }
            />

            <InfoCard
              icon={"fa-regular fa-headphones"}
              title={"24/7 Support"}
              para={
                "Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra."
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
