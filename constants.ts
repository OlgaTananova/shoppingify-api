
export const notFoundErrorStatusCode = 404;
export const conflictStatusCode = 409;
export const serverErrorStatusCode = 500;
export const badRequestStatusCode = 400;


export const conflictMessage = (item: string) =>  `This ${item} already exists.`;
export const serverErrorMessage: string = 'Something went wrong :(';
export const notFoundMessage = (item: string) => `This ${item} is not found.`;
export const notFoundListMessage = (item: string) => `There are no ${item}.`;
