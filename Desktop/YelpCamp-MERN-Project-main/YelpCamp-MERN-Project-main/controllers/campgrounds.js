

const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const { cloudinary } = require('../cloudinary');
const { query } = require('express');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Body', 404);

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;


    campground.images = req.files.map(f => ({ Url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);

    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`campgrounds/${campground._id}`);
}


module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'

        }
    }).populate('author');
    // console.log(campground);

    //use of populate
    // Using populate() makes it easier to work with related data. You can access all the information about reviews directly without 
    // making additional queries. This is particularly useful for displaying details of related documents (like showing a list of reviews on a campground page).
    if (!campground) {
        req.flash('error', 'Can\'t find Campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    // if middleware is written then no need to write below one
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error','You dont have access to edit this Campground');
    //     return res.redirect(`/campgrounds/${id}`)
    // }

    res.render('campgrounds/edit', { campground });

}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;


    // Update basic campground details
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    // Add new images if uploaded
    console.log();
    if (req.files && req.files.length > 0) {
        
        const newImages = req.files.map(f => ({ Url: f.path, filename: f.filename }));
        
        campground.images.push(...newImages); // Push new images into existing array
    }
    await campground.save();  // Save after adding new images

    // Handle deletion of images
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);  // Delete from Cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.deleteCampground = async (req, res) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground');

    res.redirect('/campgrounds');
}