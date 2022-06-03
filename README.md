# Complete User Model Template

This is a backend project template for anyone planning to create a project aiming for having a user model schema and authentication.Designed for managing large user based web applications
## Features:
- New User signup
- user Login and Logout
- Forgot password email validation
- Password Reset based on JsonWebTokens
- Update Password
- view user details dashboard
- Update User information by user
- Admin can view all user details
- Admin get information about single user
- Admin updating user details
- Admin deleting a registered user
- Manager role-managers can only view  users
- Users can not access manager or admin Information
------
### Technologies 

- Javascript
- [Express] - as Framework
- MongoDB - as Database
- Mongoose - as ODM
- bcryptjs - for Password Encryption
- EJS - for html templating
- Cloudinary - for Storing Images
- Mailtrap - for mail testing

### Tools requirement
- POSTMAN
- any Code editor or IDE (VS CODE preferably) 
- MongoDB
- MongoDB Compass
- Nodejs
- NPM
## Installation

requires [Node.js](https://nodejs.org/) v14+ to run.
First either download this repository or clone this repository .
go to the directory by:
```sh
cd Usermodel
```
_Open this project in a IDE_
```sh
code .
```
Install the dependencies.
```sh
npm install
```
IF you wish to run the project in a development Environment.
```sh
npm install -D nodemon
```
Start the mongodb daemon by running ``` C:\mongodb\bin\mongod.exe ``` in the Command Prompt.
Or for windows by going to
````
C:\Program Files\MongoDB\Server\5.0\bin\mongo.exe
````
Open __MongoDB COMPASS__ and click > _connect_
- Open a free account in (https://cloudinary.com/)
- Signup a free account in (https://mailtrap.io/)

**Open a folder in your cloudinary account naming 'users' to store user_profile_photos
____
__From your Cloudinary Dashboard Copy:__
- Cloud name
- API key
- API Secret code
____
**From your mailtrap account copy:**
Go to Inboxes > My Inbox > SMTP settings > Integrations
and Select __Nodemailer__ from the dropdown and copy:

- host
- port
- User
- Pass
____
Now go to __.env__ file and paste those values ..

Now you can Start the server in a Development Environment
```sh
npm run dev
```

Open __Postman__ and create a new environment as DOMAIN
```http://localhost:4000/api/v1```
Now these api routes can be explored:

{{DOMAIN}}/signup >> __to signup a new user__
{{DOMAIN}}/login >> __to login a resistered user using email and password__
{{DOMAIN}}/logout >> __to clear saved cookies and logging out a user__
{{DOMAIN}}/forgotpassword >> __to send a forgotpassword request__
{{DOMAIN}}/password/reset/:token >> __to get a testing email with reset password token__
{{DOMAIN}}/userDashboard >> __for registered users to see their dashboard__
{{DOMAIN}}/password/update >> __to update password for logged in user__
{{DOMAIN}}/userdashboard/update >> __to update user information by a user__
{{DOMAIN}}/admin/users >> __to get an array of informations on all the registered users__
{{DOMAIN}}/managers/users >> __to find only information about users__
##### Additionally
{{DOMAIN}}/admin/user/:id >> __to find a single user based on userID__ (get request)
{{DOMAIN}}/admin/user/:id >> __to update a single user information by admin__ (put request)
{{DOMAIN}}/admin/user/:id >> __to delete a single user__ (delete request)

** Note: to get admin activity you have to manually update the role of a registered user to "Admin" from MongoDB compass

