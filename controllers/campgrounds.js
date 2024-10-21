
const Campground = require('../models/campground');

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm=(req, res) => {
   
    res.render('campgrounds/new');
}

module.exports.createNewForm=async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Body', 404);

    const campground = new Campground(req.body.campground);
    campground.author=req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`campgrounds/${campground._id}`);
}


module.exports.showCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
       
        }
        }).populate('author');
    // console.log(campground);
    
    //use of populate
    // Using populate() makes it easier to work with related data. You can access all the information about reviews directly without 
    // making additional queries. This is particularly useful for displaying details of related documents (like showing a list of reviews on a campground page).
    if(!campground)
    {
        req.flash('error','Can\'t find Campground');
       return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm=async (req, res) => {
    const {id}=req.params;
        const campground = await Campground.findById(req.params.id);
        if(!campground)
        {
            req.flash('error','Campground not found');
            return res.redirect('/campgrounds');
        }
        // if middleware is written then no need to write below one
        // if(!campground.author.equals(req.user._id)){
        //     req.flash('error','You dont have access to edit this Campground');
        //     return res.redirect(`/campgrounds/${id}`)
        // }
    
        res.render('campgrounds/edit', { campground });
    
    }

module.exports.editCampground=async (req, res) => {
    const {id}=req.params;
    // const campground=await Campground.findById(id);
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error','You dont have access to edit this Campground');
    //     res.redirect(`/campgrounds/${id}`)
    // }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully Update an Campground');
 
    res.redirect(`/campgrounds/${campground._id}`);
    // if we remove / in redirect this is depepenedt on current URL after that it appeneds the gieven path
    // if we include / in path it is independent on whatever path we in current html it will always redirect to given path it is best way
}

module.exports.deleteCampground=async (req, res) => {
   
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground');

    res.redirect('/campgrounds');
}