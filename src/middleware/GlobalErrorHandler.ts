import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../shared/NotFoundError";
import { ConflictError } from "../shared/ConflictError";

export const GlobalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if(err instanceof NotFoundError){
    return res.status(404).json({
      error: err.message
    })
  }

  if(err instanceof ConflictError){
    return res.status(409).json({
      error: err.message
    })
  }

  console.log(err);
  res.status(500).json({ success: false, message: "Internal server error" });
};
