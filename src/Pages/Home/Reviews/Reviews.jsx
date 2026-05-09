import { use } from "react";

const Reviews = ({ reviewsPromise }) => {
    const reviews = use(reviewsPromise);
    console.log(reviews);
  return (
  <div>

  </div>
  );
};

export default Reviews;