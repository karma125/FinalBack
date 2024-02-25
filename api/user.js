const express = require('express');
const dbService = require('../db.service');
const { ObjectId } = require('mongodb');
const router = express.Router();

router.get('/getTeachers', getTeachers);
router.post('/getTeachersByKinder', getTeachersByKinder);
// router.get('/:id', getUser)
// router.put('/:id', updateUser)
// router.delete('/:id', deleteUser)

async function add(user) {
	try {
		const collection = await dbService.getCollection('user');
		await collection.insertOne(user);
		return user;
	} catch (err) {
		console.log('cannot add user', err);
		throw err;
	}
}
async function getByID(userIdToFind) {
	try {
		const collection = await dbService.getCollection('user');
		const user = await collection.findOne({ _id: new ObjectId(userIdToFind) });
		return user;
	} catch (err) {
		console.log(`while finding user by id: ${userIdToFind}`, err);
		throw err;
	}
}

async function getByEmail(email) {
	try {
		const collection = await dbService.getCollection('user');
		const user = await collection.findOne({ email });
		return user;
	} catch (err) {
		console.log(`while finding user by email: ${email}`, err);
		throw err;
	}
}

async function getTeachersByKinder(req, res) {
	try {
		const { kindergartenName } = req.body;
		const collection = await dbService.getCollection('user');
		const teachers = await collection.find({ kindergartenName }).toArray();

		res.json(
			teachers.map(teacher => ({
				_id: teacher._id,
				fullName: teacher.firstName + ' ' + teacher.lastName,
				email: teacher.email,
			}))
		);
	} catch (err) {
		console.log('failed getting the teachers');
		res.status(500).send({ err: 'failed getting the teachers' });
	}
}

async function getTeachers(req, res) {
	try {
		let job = 'גננת';
		const collection = await dbService.getCollection('user');
		const teachers = await collection.find({ job }).toArray();

		res.json(
			teachers.map(teacher => ({
				_id: teacher._id,
				fullName: teacher.firstName + ' ' + teacher.lastName,
				email: teacher.email,
			}))
		);
	} catch (err) {
		console.log('failed getting the teachers');
		res.status(500).send({ err: 'failed getting the teachers' });
	}
}

// async function sendMailToUser(to, from, task) {
// 	try {
// 		const ToEmail = await getByID(to)
// 		const fromEmail = await getByID(from)

// 		sendEmail({
// 			to: ToEmail,
// 			from: fromEmail,
// 		})
// 	} catch (err) {
// 		console.log('failed getting the teachers')
// 	}
// }

module.exports = { router, userService: { add, getByEmail, getByID } };
