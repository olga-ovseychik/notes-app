import { Filter } from "../models/filterModel.js";

export const getFilters = async (req, res) => {
	try {
		const results = await Filter.find({});
		res.send(results);
	  } catch (error) {
		console.error(error);
		res.status(500).send({ error });
	  }
}