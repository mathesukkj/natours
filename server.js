import { config } from "dotenv";
config({ path: "./config.env" });
import app from "./app.js";

app.listen(process.env.PORT, () => {
    console.log("Listening on port 8000");
});
