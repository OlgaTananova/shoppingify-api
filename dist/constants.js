"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inCorrectEmailOrPasswordMessage = exports.notUniqueEmailConflictMessage = exports.userProfileUpdated = exports.tokenDeleted = exports.tokenSendMessage = exports.unauthorizedMessage = exports.notFoundListMessage = exports.notFoundMessage = exports.serverErrorMessage = exports.conflictMessage = exports.createdStatusCode = exports.unauthorizedStatusCode = exports.badRequestStatusCode = exports.serverErrorStatusCode = exports.conflictStatusCode = exports.notFoundErrorStatusCode = void 0;
exports.notFoundErrorStatusCode = 404;
exports.conflictStatusCode = 409;
exports.serverErrorStatusCode = 500;
exports.badRequestStatusCode = 400;
exports.unauthorizedStatusCode = 401;
exports.createdStatusCode = 201;
const conflictMessage = (item) => `The ${item} already exists.`;
exports.conflictMessage = conflictMessage;
exports.serverErrorMessage = 'Something went wrong :(';
const notFoundMessage = (item) => `The ${item} is not found.`;
exports.notFoundMessage = notFoundMessage;
const notFoundListMessage = (item) => `There are no ${item}.`;
exports.notFoundListMessage = notFoundListMessage;
exports.unauthorizedMessage = 'Access is restricted. Please log in or sign up.';
exports.tokenSendMessage = 'Token was sent to cookie.';
exports.tokenDeleted = 'Token was deleted.';
exports.userProfileUpdated = 'User\'s profile was successfully updated';
exports.notUniqueEmailConflictMessage = 'User with this email already exists.';
exports.inCorrectEmailOrPasswordMessage = 'You typed incorrect email or password. Please, try again.';
