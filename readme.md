# Getting Started - `2025-05-10`

## Project Objective

We are developing this application to streamline bill creation and various other operations related to bills, along with some Admin and User relationship management functionalities. Ultimately, this application aims to simplify the process of creating bills and managing associated tasks efficiently. It also facilitates the management of the relationship between administrators and users, ensuring smooth operation.

## Authentication Levels

- **Admin:** Higher level of privileges and control.
- **User:** Moderate level of access and capabilities.

## Project Setup

### Initializing the Project

### Installing Dependencies

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cloudinary": "^2.6.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.14.2",
    "multer": "^1.4.5-lts.2"
  }
}
```

The following packages are being used:

- `express`
- `mongoose`
- `dotenv`
- `cors`
- `cookie-parser`
- `bcrypt`
- `jsonwebtoken`
- `multer`
- `cloudinary`
- `nodemon`
- ...and more.

### Creating the App and Setting Up Middleware

```javascript
import express from "express";
import cors from "cors";
import config from "../config/config.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));

import { routeVersion } from "./constent.js";
import homeRouters from "./routes/home.routes.js";

app.use(`${routeVersion}/`, homeRouters);

app.on("error", (error) => {
  console.error(`Error occurred in the application: ${error}`);
  process.exit(1);
});

export default app;
```

### Modifying `package.json`

- `type`: `module`
- `dev`:
  ```json
  "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  ```
- ...and other configurations.

### Setting Up `.gitignore` and `.env`

### Other Initial Setups

- Database connection
- `constant` file
- Configuration file
- Helper files / utilities
- ...and more.

### Creating Data Models

- Admin
- User
- BillData
- Bill
- Firm

### Testing Controllers and Routes

```javascript
// Controller file - home.controller.js
import asyncHandler from "../Utils/AsyncHandler.js";

const home = asyncHandler(async function (req, res) {
  console.log("Working at home route controller :)");
  res.status(200).json({
    success: true,
    message: "We are ready to grind ~!",
  });
});

export { home };
```

```javascript
// Router file - home.routes.js
import { Router } from "express";
const router = Router();
import { home } from "../controllers/home.controller.js";

router.route("/").get(home);

export default router;
```

---

---

# How-to Guide

## Starting the Project

```bash
npm run dev
```

## Stopping the Project

```bash
Ctrl + C
```

## Installing Dependencies

```bash
npm install <package-name> <another-package-name> ...
```

## Uninstalling Dependencies

```bash
npm uninstall <package-name> <another-package-name> ...
```
