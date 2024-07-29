import { Note } from "../models/noteModel.js";

export const getNotes = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await Note.find({user: id}).sort('-updatedAt');
		res.send(data);
	} catch (error) {
		console.error(error);
		res.status(500).send({ error });
	}
}

export const getNote = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Note.findOne({ _id: id });
		res.send(result);
	} catch (error) {
		console.error(error);
		res.status(404).send("Record not found");
	}
}

export const createNote = async (req, res) => {
	const { text, title, user, task } = req.body;

	try {
		const newNote = new Note({ 
			text, 
			title,
			user,
			task
		});
		await newNote.save();
		res.send(newNote);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
};

export const updateNote = async (req, res) => {
	try {
		const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.send(updatedNote);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
}

export const removeNote = async (req, res) => {
	const { id } = req.params;
	try {
		await Note.findByIdAndDelete(id)
			.then((response) => { res.status(200).send({ response: id }) });
	} catch (error) {
		res.status(500).send({ response: err.message });
	}
}


