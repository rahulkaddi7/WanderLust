const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultLink = "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports = mongoose.model("Review",reviewSchema);