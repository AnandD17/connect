# Documentation

## Schema

### Connect Request
* reqSenderId => UID of request sender user
* reqReceiverId => UID of user for whom the request is sending
* time => This field stores When the requst is generated / when the request is accepted / expired / declined
* status => This field is to know that the filed is pending, accepted, declined, expired.

### Chat
* senderId => Messager sending user UID
* receiverId => Message receiving user UID
* message => message body
* status => enum['ACTIVE', 'INACTIVE']

### Booking => Users can book date/get-together via application
* orgId => Date Intiator/Organiser UID
* inviteeId => Invitee UID
* venue => Venue of the date => Eg:. nearby Cafe
* time => time of event/date
* status => enum['ACTIVE', 'INACTIVE']


## API Logic
### connect Request
* Postman collection attached consists of create Connection request, accept/decline pending requests, get proposals and requests of the user
* When a connection request is initiated It will wait for 24 hours and if the status is still pending then it will change it as expired
* When a connection request is Accepted it will expire it after 24 hours of acceptance

### Chat
* There are 3 simple Api's to create chat, to get all chat of a User and to get all chat of a user with a perticular user
* User will be not able to send chat if the connection between the user is expired
* But they can access their previous chats

### Booking
* 2 api's with Create and get bookings
* user can only book if their connection is active.


## CRON JOB
* In order to check the status of a connection and to expire it after 24 hours a cron job is running for every minute 1st second.
* This will check for the status ("PENDING" or "ACCEPTED") and the time (is more then 24 hours) then it will change the status to "EXPIRED".