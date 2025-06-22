const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//New Review
module.exports.newReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Posted Successfully!");
  res.redirect(`/listings/${listing._id}`);
};

//Delete Review
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
};
