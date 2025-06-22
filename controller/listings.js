const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index
module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

//Show Listing
module.exports.showListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { listing });
  }
};

//New listing form
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//Create new
module.exports.createNewListing = async (req, res, next) => {
  let resposnse = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  // let category = req.body.category;
  console.log(req.body);
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  // newListing.category = category;
  newListing.geometry = resposnse.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New listing created !");
  res.redirect("/listings");
};

//Edit Form
module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exists");
    res.redirect("/listings");
  } else {
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/h_300,w_250"
    );
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
  }
};

//Edit Listing
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    let saved = await listing.save();
  }

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

//Delete Lsiting
module.exports.deleteListing = async (req, res) => {
  const id = req.params.id;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
  console.log(deletedListing);
};

//Filtering categories
module.exports.searchCategory = async(req,res) =>{
  let name = req.params.name;
  let listings = await Listing.find({category:name});
  res.render("./listings/category.ejs",{listings});
};

//Searchbar
module.exports.searchBar = async(req,res)=>{
  
  let country = req.query.country;
  let listings = await Listing.find({country:country});
  res.render("./listings/country.ejs",{listings,country});
};