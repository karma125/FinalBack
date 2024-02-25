const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

//TODO: when we finish - delete cookies stuff if we don't need them
// Express App Config
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'public')));
} else {
	const corsOptions = {
		origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
		credentials: true,
	};
	app.use(cors(corsOptions));
}
const authRoutes = require('./api/auth');
const userRoutes = require('./api/user');
const taskRoutes = require('./api/task');
const contentRoutes = require('./api/content');
const feedbackRoutes = require('./api/feedback');

// routes
app.use('/api/auth', authRoutes.router);
app.use('/api/user', userRoutes.router);
app.use('/api/task', taskRoutes.router);
app.use('/api/content', contentRoutes.router);
app.use('/api/feedback', feedbackRoutes.router);

app.get('/**', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3030;
http.listen(port, () => {
	console.log('Server is running on port: ' + port);
});
