installed create react app and that is it.

-- start transferring backend and make sure it works.

add back to config.env
EMAIL_USERNAME=ae3b425ea2a0de
EMAIL_PASSWORD=1bd072a57f0c1f
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

MAILJET_USERNAME=6a18c42cc1461f2312f050001f004f32
MAILJET_PASSWORD=ab9e9f64ee8f626f5a0c09af42f2b35c
MAILJET_HOST=in-v3.mailjet.com
MAILJET_PORT=2525


## STEPS TO DEPLOY and REVERT TO DEV

- search for console.logs
- remove values from booking form (recurring also)
- remove values from login
- remove values from signup
- remove idx limit in while loop in prepareRecurring function and test booking too far in future (can not test when limit is in)
- check admin manage bookings that booking id is removed from booking dropdown
- check that updateSettings command is enabled in addBooking.mjs (sometimes removed to test booking validators without adding the booking)
- remove send welcome email from authcontroller line 51 NOT YET IMPLEMENTED
- change dev db to production db and make sure everything is working
- check for local urls, search on 127.0.0.1 or local
- check that email from and to and host and all email values are correct
- for Heroku, in package.json, make sure start command is "start": "node server.js"
- for Heroku, make sure you have engines command {"engines": {"node":">="10.0.0"}}
- for Heroku, (this app in server.js) make sure const port = process.env.PORT || 3000
- git push your changes
- for Heroku, deploy command login to heroku cli with command: heroku login
- then once logged into Heroku execute command: git push heroku master
- app located at schedulervarsityclinic.herokuapp.com
- test signup, login, booking, recurring booking
