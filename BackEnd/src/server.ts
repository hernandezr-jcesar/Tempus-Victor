// Import statements with types
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

/////  IMPORTING ROUTES  ////
import authRouter from "./routes/auth.routes";
import categoryRouter from "./routes/category.routes";
import defaultRouter from "./routes/default.routes";
import eventRouter from "./routes/event.routes";
import noteRouter from "./routes/note.routes";
import pomodoroEventRouter from "./routes/pomodoroEvent.routes";
import pomodoroSessionRouter from "./routes/pomodoroSession.routes";
import settingRouter from "./routes/setting.routes";
import tasksRouter from "./routes/task.routes";
import userRouter from "./routes/user.routes";
import bodyParser from "body-parser";

interface UserBasicInfo {
  idUser: number;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

const app = express(); // Type inference for app (express.Application)

app.use(bodyParser.json({ limit: "10mb" }));
/////  MIDDLEWARES /////
// Middlewares with type annotations

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8081"],
  } as cors.CorsOptions)
);
app.use(cookieParser());

app.use(express.json()); // Type inference for request body parsing
app.use(express.urlencoded({ extended: true })); // Type inference for form data parsing

// Route usage with type annotations
app.use(authRouter);
app.use(userRouter);
app.use(categoryRouter);
app.use(defaultRouter);
app.use(eventRouter);
app.use(noteRouter);
app.use(pomodoroEventRouter);
app.use(pomodoroSessionRouter);
app.use(settingRouter);
app.use(tasksRouter);
// Error handler with type annotations
// En caso de que no se encuentre
app.use((req: express.Request, res: express.Response) => {
  res.status(404).send("No se encontro esta pagina");
});

export default app;
