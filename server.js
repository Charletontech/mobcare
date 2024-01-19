const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
require('dotenv').config();


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser to parse form data

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(filePath);
});



app.get('/signup', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'signup.html');
  res.sendFile(filePath);
});

app.get('/subscription', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'subscription.html');
  res.sendFile(filePath);
});

app.post('/form-submission', (req, res) => {
  //PROCESSING DATA FROM FORM
  var {firstName, middleName, lastName, email, dob, gender, phone, model, referrer, brand, color, value, plan, address} = req.body
  
  //LOGIC TO CONVERT DATE TO REQUIRED FORMAT
  function convertDate(inputDate) {
    // Parse the input date (assuming yyyy-mm-dd format)
    const parsedDate = new Date(inputDate);
  
    // Format the date in the desired format (yyyy-mm-ddTHH:mm:ss.sssZ)
    const formattedDate = parsedDate.toISOString();
  
    return formattedDate;
  }
  const convertedDate = convertDate(dob);
  
  
  
  var formData = {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    email: email,
    dob: convertedDate,
    gender: gender,
    phone: phone,
    model: model,
    referrer: referrer,
    brand: brand,
    color: color,
    value: value,
    plan: plan,
    address: address
  }

  
  //LOGIC TO GENETRATE TOKEN AND LOGON
  var logonRequestData = JSON.stringify({
    "clientKey": `${process.env.CLIENT_KEY}`,
    "clientSecret": `${process.env.CLIENT_SECRET}`,
    "clientId": `${process.env.CLIENT_ID}`,
    "rememberMe": true
  })
  
  var logonRequestOptions = {
    hostname: '196.46.20.83',
    port: 3021,
    path: '/clients/v1/auth/_login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': logonRequestData.length,
    },
  };
  const logonHttpSender = http.request(logonRequestOptions, (response) =>{
    let = recievedLogonData = ''

    response.on('data', (chunk) => {
      recievedLogonData += chunk;
    });
  
    response.on('end', () => {
      var parsedRecievedLogonData = JSON.parse(recievedLogonData);
      console.log(parsedRecievedLogonData)
       //LOGIC TO CREATE BANK WALLET        
        const walletCreationRequestData = JSON.stringify({
          phoneNumber: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          gender: formData.gender,
          dateOfBirth: formData.dob,
          productCode: "214",
          email: formData.email,
          type: 1
        });

        
      // Setting up the options for the HTTP request
        const requestOptions = {
          hostname: '196.46.20.83',
          port: 3021,
          path: '/clients/v1/accounts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': walletCreationRequestData.length,
            'Authorization': `Bearer ${parsedRecievedLogonData.token}`
          },
        };
        
        const httpRequestSender = http.request(requestOptions, (response2) => {
          let data2 = '';
        
          response2.on('data', (chunk) => {
            data2 += chunk;
          });
        
          response2.on('end', () => {
            var newAccoutDetails = JSON.parse(data2);
            console.log(newAccoutDetails);
            
          //sending the notification to the user
            const accountNumber = newAccoutDetails.account
            var fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`
            res.render('notify', {accountNumber, fullName})


          // Mailing sign up details to Admin
            const transporter = nodemailer.createTransport({
              host: 'smtp.elasticemail.com',
              port: 2525, // Make sure port is specified as a number (not a string)
              secure: false, // Set secure as a boolean
              auth: {
                user: 'phoenixdigitalcrest@mail.com',
                pass: `${process.env.EMAIL_PASS}`,
              },
            });

          
            //Mail details
            const mailContent = {
              from: 'phoenixdigitalcrest@mail.com',
              to: `adsbyshante@gmail.com`,
              subject: `New user! ${formData.firstName} ${formData.middleName} ${formData.lastName}`,
              html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                  /* Reset styles for email clients */
                  body, p {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                  }
              
                  /* Container */
                  .container {
                    background-color: white;
                    padding: 20px;
                  }
              
                  /* Header */
                  .header {
                    background-color: #046599;
                    color: white;
                    text-align: center;
                    padding: 12px 15px; 
                  }
              
                  /* Company Logo */
                  .logo {
                    text-align: center;
                    margin-bottom: 20px;
                    display: block;
                    margin: auto;
                  }
              
                  /* Logo Image */
                  .logo img {
                    width: 100px; /* Adjust the size as needed */
                    height: 100px; /* Adjust the size as needed */
                    border-radius: 50%; /* Makes the logo round */
                  }
              
                  /* Content */
                  .content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 3px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    color: black;
                    line-height: 1.4rem; 
                  }
              
                  h3{
                    color:  #00a24a;
                  }

                  .token{
                    color: rgb(38, 145, 38);
                    letter-spacing: 3px;
                  }
              
                  /* Footer */
                  .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #777;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                    <div class="logo">
                    </div>
                  <div class="header">
                    
                    <h1>New User</h1>
                  </div>
                  <div class="content">
                    <p>
                    <h3>Details:</h3>
                    <p>Full Name: ${formData.firstName} ${formData.middleName} ${formData.lastName}</p>
                    <p>Account Number: ${accountNumber}</p>
                    <p>Phone Number: ${formData.phone}</p>
                    <p>Phone Model: ${formData.model}</p>
                    <p>Phone Brand: ${formData.brand}</p>
                    <p>Phone Color:${formData.color}</p>
                    <p>Insurance Plan: ${formData.plan}</p>
                    <p>Customer Address: ${formData.address}</p>
                    <p>Name Of Referrer: ${formData.referrer}</p>
                    </p>
                  </div>
                  <div class="footer">
                    <p>Mobcare &copy; 2024 </p>
                  </div>
                </div>
              </body>
              </html>
              
               `
             }

            //Sending the mail
            transporter.sendMail(mailContent, (error, info) =>{
              if (error){
                console.error('error sending mail', error)
              }else{
                console.log('Email sent', info.response)
               }
            })
        
          });
       });
        
        httpRequestSender.on('error', (error) => {
          console.error('Error in HTTP request:', error.message);
          var errorMessage = error.message
          res.render('notify', {errorMessage, message: 'Not Successful'})
        });
        
        httpRequestSender.write(walletCreationRequestData);
        httpRequestSender.end();
            
      })

  })
  logonHttpSender.on('error', (error) => {
    console.error('Error in HTTP request:', error.message);
    var errorMessage = error.message
    res.render('notify', {errorMessage, message: 'Not Successful'})
  });

  logonHttpSender.write(logonRequestData);
  logonHttpSender.end();
})

app.listen(3000, () => {
  console.log('Listening at port 3000...');
});
