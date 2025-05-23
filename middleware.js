const Listing = require("./models/listing");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Login to continue");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRediectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params; 
    let listing = await Listing.findById(id);
    const user = res.locals.currentUser;
    const isOwner = listing.owner.equals(user._id);
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}