class apiResponse {
  constructor(statusCode, data, message = "Success") {
    this.data = data
    this.message = message
    this.statuscode = statusCode
    this.success = statusCode < 400
  }
}