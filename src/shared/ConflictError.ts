export class ConflictError extends Error {
  constructor(message: string = "Conflict Error"){
    super(message)
    this.name = "ConflictError"
  }
}