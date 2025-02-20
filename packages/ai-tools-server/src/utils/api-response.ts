interface ApiResponse<T> {
  err: number; // 0 for success, non-zero for error
  msg?: string; // Optional message (e.g., error description or success message)
  data?: T; // Optional data payload of type T
}

/**
 * Helper function to create a successful ApiResponse with data.
 * @template T The type of the data.
 * @param data The data payload.
 * @param msg Optional success message.
 * @returns ApiResponse with err: 0 and provided data and message.
 */
function successResponse<T>(data: T, msg?: string): ApiResponse<T> {
  return { err: 0, msg, data };
}

/**
 * Helper function to create a successful ApiResponse without data.
 * @param msg Optional success message.
 * @returns ApiResponse with err: 0 and provided message, no data.
 */
function successResponseNoData(msg?: string): ApiResponse<void> {
  return { err: 0, msg, data: undefined }; // or data: void, but undefined is more common for optional
}

/**
 * Helper function to create an error ApiResponse.
 * @param errCode The error code (non-zero).
 * @param msg The error message.
 * @returns ApiResponse with specified err code and message, no data.
 */
function errorResponse( msg: string): ApiResponse<void> {
  return { err: -1, msg };
}

export { successResponse, successResponseNoData, errorResponse };
