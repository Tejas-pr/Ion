import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@ion/auth/auth"

export const { POST, GET } = toNextJsHandler(auth);