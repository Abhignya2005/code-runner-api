const express = require("express");

const mongoose = require("mongoose");
const Execution = require("./models/Execution");
mongoose.connect("mongodb://127.0.0.1:27017/codeRunner");

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected ✅");
});

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

const { exec } = require("child_process");
const fs = require("fs");

// app.post("/run-code", (req, res) => {
//   const { code } = req.body;

//   // create a temporary python file
//   const fileName = "temp.py";

// fs.writeFileSync(fileName, code, { encoding: "utf-8" });

//   // execute python code
// exec(`python -X utf8 ${fileName}`, (error, stdout, stderr) => {
//     if (error) {
//       return res.json({ error: error.message });
//     }

//     if (stderr) {
//       return res.json({ error: stderr });
//     }

//     return res.json({ output: stdout });
//   });
// });

app.get("/history", async (req, res) => {
  try {
    const data = await Execution.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post("/run-code", async (req, res) => {
  const { code, input, language } = req.body;

  let fileName;

if (language === "python") {
  fileName = "temp.py";
} else if (language === "c") {
  fileName = "temp.c";
} else if (language === "java") {
  fileName = "Main.java";
}


fs.writeFileSync(fileName, code, { encoding: "utf-8" });

const path = process.cwd();
let command = "";

if (language === "python") {
  if (input) {
    command = `echo ${input} | docker run --rm -i -v "${path}:/app" -w /app python python ${fileName}`;
  } else {
    command = `docker run --rm -v "${path}:/app" -w /app python python ${fileName}`;
  }
}

else if (language === "c") {
  if (input) {
    command = `echo ${input} | docker run --rm -i -v "${path}:/app" -w /app gcc bash -c "gcc ${fileName} -o temp && ./temp"`;
  } else {
    command = `docker run --rm -v "${path}:/app" -w /app gcc bash -c "gcc ${fileName} -o temp && ./temp"`;
  }
}

else if (language === "java") {
  command = input
    ? `echo ${input} | docker run --rm -i -v "${path}:/app" -w /app eclipse-temurin:17 bash -c "javac ${fileName} && java Main"`
    : `docker run --rm -i -v "${path}:/app" -w /app eclipse-temurin:17 bash -c "javac ${fileName} && java Main"`;
}
  
  exec(command, { timeout: 10000 }, async (error, stdout, stderr) => {
    if (error) {
    await Execution.create({
      code,
      language,
      input,
      error: error.message
    });

    if (error.killed || error.signal === "SIGTERM") {
      return res.json({ error: "Execution timed out ⏳" });
    }

    return res.json({ error: error.message });
  }

  if (stderr) {
    await Execution.create({
      code,
      language,
      input,
      error: stderr
    });

    return res.json({ error: stderr });
  }

  // success
  await Execution.create({
    code,
    language,
    input,
    output: stdout.trim()
  });

  return res.json({ output: stdout.trim() });
});
});