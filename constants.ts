
export const notFoundErrorStatusCode = 404;
export const conflictStatusCode = 409;
export const serverErrorStatusCode = 500;
export const badRequestStatusCode = 400;
export const unauthorizedStatusCode = 401;
export const createdStatusCode = 201;


export const conflictMessage = (item: string) =>  `The ${item} already exists.`;
export const serverErrorMessage: string = 'Something went wrong :(';
export const notFoundMessage = (item: string) => `The ${item} is not found.`;
export const notFoundListMessage = (item: string) => `There are no ${item}.`;
export const unauthorizedMessage = 'Access is restricted. Please log in or sign up.';
export const tokenSendMessage = 'Token was sent to cookie.';
export const tokenDeleted = 'Token was deleted.'
export const userProfileUpdated = 'User\'s profile was successfully updated';
export const notUniqueEmailConflictMessage = 'User with this email already exists.'
export const inCorrectEmailOrPasswordMessage = 'You typed incorrect email or password. Please, try again.'
