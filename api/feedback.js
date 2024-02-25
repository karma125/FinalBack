const express = require('express');
const dbService = require('../db.service');

const router = express.Router();

router.post('/addFeedback', addFeedback);
router.post('/getFeedback', getFeedback);

async function addFeedback(req, res) {
	try {
		const file = req.body;
		console.log(file);

		const collection = await dbService.getCollection('feedback');
		await collection.insertOne(file);
		res.json(file);
	} catch (err) {
		console.log('Failed add feedback ' + err);
		res.status(500).send({ err: 'Failed to feedback' });
	}
}

async function getFeedback(req, res) {
	try {
		const kindergartenName = req.body.kindergartenName; // Assuming kindergartenName is inside req.body

		const collection = await dbService.getCollection('feedback');
		const query = { "createdBy.kindergartenName": kindergartenName };
		const allFeedback = await collection.find(query).toArray();
console.log(allFeedback)
		res.json(allFeedback);
	} catch (err) {
		console.log('Failed to get feedback ' + err);
		res.status(500).send({ err: 'Failed to get feedback ' });
	}
}



module.exports = { router };
