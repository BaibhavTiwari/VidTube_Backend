# VidTube_Backend

- [Model](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj?origin=shareV) you can find the architecture of the project here.

--------------------------------------

## Description
This project is a complex backend project that is built with nodejs, expressjs, mongodb, mongoose, jwt, bcrypt, and many more. This project is a complete backend project that has all the features that a backend project should have. We are building a complete video hosting website similar to youtube with all the features like login, signup, upload video, like, dislike, comment, reply, subscribe, unsubscribe, and many more.

Project uses all standard practices like JWT, bcrypt, access tokens, refresh Tokens and many more. We have spent a lot of time in building this project and we are sure that you will learn a lot from this project.

## Getting Started

To get started with the application, you will need to have Node.js installed on your system. Clone the repository and install the required packages using npm:

```
git clone https://github.com/BaibhavTiwari/VidTube_Backend.git
cd VidTube_Backend
npm install
```

You will also need to sign up for a cloudinary account and get your API key.

## Using the Application

Create a new .env file in the root folder of the project and add the following line in it.
```
PORT = 
CORS_ORIGIN=* //for all
MONGODB_URL=
ACCESS_TOKEN_SECRET=g
ACCESS_TOKEN_EXPIRY= "give time in days like 1d 2d"
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY="give time in days like 1d 2d"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

To use the application, start the development server using the following command:

```
npm run dev
```


## Contributing

If you want to contribute to this project, feel free to fork the repository and submit a pull request. Please follow the existing code style and include tests for any new functionality.