import { Link } from "react-router-dom";

export const ExploreTopBooks = () => {
  return (
    <div className="p-5 mb-4 bg-dark header">
      <div className="container-fluid text-white d-flex justify-content center">
        <div>
          <h1 className="display-5 fw-bold">Find Your next adventure</h1>
          <p className="col-md-8 fs-4">where would you like to go next?</p>
          <Link
            to="/search"
            type="button"
            className="btn main-color btn lg text-white"
          >
            Explore top books
          </Link>
        </div>
      </div>
    </div>
  );
};
