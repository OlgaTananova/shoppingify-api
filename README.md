# Shoppingify - backend part
## Description
Shoppingify is an application for creating shopping lists and tracking expenses based on those lists.
## Technologies:
- [x] TypeScript
- [x] Express.js
- [x] MongoDB
- [x] Mongoose
- [x] JWT
- [x] Jest
- [x] EsLint
- [x] Celebrate
- [x] Winston
- [x] Pdf-parse
- [x] OpenAI API
- [x] AWS Cloud
## What is done at the backend:
- [x] User registration, authorization, authentication - users can easily create accounts, log in, log out, and change their passwords securely.
- [x] Creating list of categories and products - the application provides features for creating categories and products, which can be utilized to build comprehensive shopping lists.
- [x] Creating, updating, and deleting shopping lists - users can create, update, and delete their shopping lists effortlessly. This enables them to keep track of their expenses and manage their shopping needs effectively.
- [x] Uploading bills in pdf format and merging them with the existing shopping lists - users can upload bills in pdf format, merge them with the existing shopping lists or upload them as new shopping lists. The uploaded lists are parsed by pdf-parse library and sent to OpenAI API, which returns the list of products and their prices in JSON format.
- [x] All requests are build on REST architecture and are validated by Celebrate library to ensure the security and integrity of the application.
- [x] All routes are protected by JWT authentication to ensure that only authorized users can access them.
- [x] Errors are handled by the general error handler and Winston logger, this  ensures that errors are properly captured and logged for effective troubleshooting and maintenance.
- [x] All routes are tested by Jest which ensures that  the functionality remains reliable and consistent.
- [x] The application is deployed on AWS Cloud.

[Link to the app](https://olgatananova.github.io/shoppingify)

[Link to the frontend part on GitHub](https://github.com/OlgaTananova/shoppingify-api)


