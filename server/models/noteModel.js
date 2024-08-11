import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        default: '',
        required: false
    },
    completed: {
        type: Boolean,
        default: false,
        required: false
    },
})

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
        required: false
    },
    text: {
        type: String,
        required: false
    },
    user: {
        type: String,
        required: true
    },
    flagged: {
        type: Boolean,
        default: false,
        required: false
    },
    task: {
        type: Boolean,
        default: false,
        required: false
    },
    todos: {
        type: [todoSchema]
    },
    tags: {
        type: Array,
        default: [],
        required: false
    },
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);
