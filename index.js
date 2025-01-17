const express = require('express');
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const pdfTemplate = require("./receipt");
const cors = require('cors');
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const port = process.env.PORT || 2000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.post('/send-receipt', async (req, res) => {

        // const {_id} =  req.body;
        const { email } = req.body;
        const { name } = req.body;
        const {sub_end_date} =req.body;

        const inputDate = sub_end_date
        const parts = inputDate.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        
        const date = new Date(year, month - 1, day);
        
        // const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const options = {  dateStyle: 'medium'};
        const expiry_sub_date = new Intl.DateTimeFormat('en-NG', options).format(date);
        
    

        const content = pdfTemplate(
          name,
          expiry_sub_date
          );
        
        const recipientEmail = email;



// Function to send email with attached PDF
async function sendEmail( email ) {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    },
  });


  const mailOptions = {
    from: '"HouseHelp App Support" <support@househelpapp.com>',
    to: `${email}`,
    subject: "Subscription reminder ⏳",
    html:  content,

  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent !" });
    console.log('Email sent successfully.');
  } catch (err) {
      res.status(500).json({ message: `server error, couldn't send` });
    console.error('Error sending email:', err);
  }
}

sendEmail(recipientEmail)

});


app.listen(port);