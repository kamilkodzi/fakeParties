# Hi, and wellcome in to my homework section June2018.
I called it homework due to the recruitment task. 
This is alpha version so everything is under development.
Common errors are handdled- application should not stop or crash
You can browse my last update on heroku: [FineParties](https://fineparties.herokuapp.com/)
Available options: sign up, login, create-edit-delete event, search by name-category-localisation-localiation/sphere.

## What is under hood?
external DB (MongoDB) provided by [mlab](https://mlab.com),
external IMG Host provided by [cloudinary](https://cloudinary.com),
Geocoding API & Google Maps API provided by [google](https://google.com)
pictures downloaded from [unsplash](https://unsplash.com/) - apologize: i`ll include information about unsplash source... later


## How to run it ?:
1. Clone repository
2. $ npm start
3. Create .env file in main folde (the same place like app.js) and file has to look like:
GEOCODER_API_KEY=tHiSiSanExAmPlE
CLOUDINARY_URL=cloudinary://tHiSiSanExAmPlE
DATABASEURL=mongodb://tHiSiSanExAmPlE
4. If you run $ node app.js for the first time uncomment line 32: // seedDB(); for load categories
5. Then comment it again.