const express = require('express');
const dbService = require('../db.service');
const { ObjectId } = require('mongodb');

const router = express.Router();

router.post('/addContent', addContent);
router.get('/getContent', getContent);
router.delete('/removeContent', removeContent);

async function addContent(req, res) {
	try {
		const file = req.body;
		console.log(file);

		const collection = await dbService.getCollection('content');
		await collection.insertOne(file);
		res.json(file);
	} catch (err) {
		console.log('Failed to Login ' + err);
		res.status(500).send({ err: 'Failed to Login' });
	}
}

async function getContent(req, res) {
	try {
		const collection = await dbService.getCollection('content');
		const allContent = await collection.find().toArray();

		res.json(allContent);
	} catch (err) {
		console.log('Failed to Login ' + err);
		res.status(500).send({ err: 'Failed to Login' });
	}
}

async function removeContent(req, res) {
	try {
		const { contentId } = req.body;
		console.log('contentId', contentId);
		const collection = await dbService.getCollection('content');
		await collection.deleteOne({ _id: new ObjectId(contentId) });
		res.status(200).send({ message: 'Content removed successfully' });
	} catch (err) {
		console.log(`cannot remove content`, err);
		res.status(500).send({ error: 'Internal server error' });
		throw err;
	}
}

module.exports = { router };
