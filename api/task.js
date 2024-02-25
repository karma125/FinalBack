const express = require('express');
const dbService = require('../db.service');
const { ObjectId } = require('mongodb');
const { sendMailToUser } = require('../emailService');
const { userService } = require('./user');

const router = express.Router();

router.post('/addTask', addTask);
router.post('/getUserTasks', getTaskByUserId);
router.post('/updateTask', updateTask);
router.get('/getAllTasks', getAllTasks);

async function addTask(req, res) {
	const task = req.body;
	try {
		const collection = await dbService.getCollection('task');
		await collection.insertOne(task);
		const toUser = await userService.getByID(task.userId);
		if (toUser) {
			sendMailToUser(toUser, task.taskName, 'newTask');
		}

		res.json(task);
	} catch (err) {
		console.log('cannot add task', err);
		res.status(500).send({ err: 'failed adding the task' });
	}
}

async function getTaskByUserId(req, res) {
	const { userId } = req.body;

	try {
		const collection = await dbService.getCollection('task');
		const tasks = await collection.find({ userId }).toArray();

		res.json(tasks);
	} catch (err) {
		console.log('cannot get task by UserId', err);
		res.status(500).send({ err: 'cannot get task by UserId' });
	}
}

async function getAllTasks(req, res) {
	try {
		const collection = await dbService.getCollection('task');
		const tasks = await collection.find({}).toArray();
		res.json(tasks);
	} catch (err) {
		console.log('cannot get all tasks', err);
		res.status(500).send({ err: 'cannot get all tasks' });
	}
}

async function updateTask(req, res) {
	try {
		const task = req.body;
		const collection = await dbService.getCollection('task');
		let updateFields = { ...task };

		const toUser = await userService.getByID(
			task.taskStatus === 'בוצע' ? task.createdBy : task.userId
		);

		if (toUser) {
			sendMailToUser(toUser, task.taskName, 'doneTask');
		}

		delete updateFields._id;
		await collection.updateOne({ _id: new ObjectId(task._id) }, { $set: updateFields });
		res.json(task);
	} catch (err) {
		console.log(`cannot update task ${task._id}`, err);
		res.status(500).send({ err: 'cannot update task' });
	}
}

module.exports = { router };
