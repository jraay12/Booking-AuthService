export class UnAuthorizedError extends Error {
  constructor(message: string = "Unauthorize"){
    super(message)
    this.name = "UnAuthorizedError"
  }
}