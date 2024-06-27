import mongoose from "mongoose";

const filterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
} , { timestamps: true });

export const Filter = mongoose.model('Filter', filterSchema);