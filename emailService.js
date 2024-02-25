var nodemailer = require('nodemailer')
var projectEmail = 'alexdoremi1@gmail.com'

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: projectEmail,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
})
const mailHelper = {
	newTask: {
		subject: 'התווספה משימה חדשה',
		txt: 'התווספה',
	},
	doneTask: {
		subject: 'משימה בוצעה בהצלחה',
		txt: 'בוצעה',
	},
}

async function sendMailToUser(toUser, task, why) {
	try {
		sendEmail({
			to: toUser.email,
			from: projectEmail,
			subject: mailHelper[why].subject,
			html: `<div style="direction: rtl; text-align: right; font-family: 'Arial', sans-serif; color: #333; background-color: #f7f7f7; padding: 20px;">
			<h1 style="margin-bottom: 10px; font-size: 24px; color: #007BFF;">שלום, ${toUser.firstName}</h1>
			<p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">המשימה ${task} ${mailHelper[why].txt}</p>
	</div>`,
		})
	} catch (err) {
		console.log('failed sending email')
	}
}

const sendEmail = mailOptions => {
	console.log(mailOptions)
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('Email sent: ' + info.response)
		}
	})
}

module.exports = { sendMailToUser }
