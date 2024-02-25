const express = require('express');
const { userService } = require('./user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/getUser', getUser);

async function login(req, res) {
	try {
		const { email, password } = req.body;
		debugger;
		const user = await userService.getByEmail(email);
		if (!user) throw new Error('Invalid username or password');
		const match = await bcrypt.compare(password, user.password);
		if (!match) throw new Error('Invalid username or password');

		delete user.password;
		user._id = user._id.toString();

		res.json(user);
	} catch (err) {
		console.log('Failed to Login ' + err);
		res.status(500).send({ err: 'Failed to Login' });
	}
}

async function getUser(req, res) {
	try {
		const { email } = req.body;
		const user = await userService.getByEmail(email);

		res.json(user);
	} catch (err) {
		console.log('Failed to get user ' + err);
		res.status(500).send({ err: 'Failed to get user' });
	}
}

async function signup(req, res) {
	try {
		const credentials = req.body;
		await userService.add(credentials);

		res.send({ msg: 'sign up successfully' });
	} catch (err) {
		console.log('Failed to signup ' + err);
		res.status(500).send({ err: 'Failed to signup' });
	}
}

module.exports = { router };
