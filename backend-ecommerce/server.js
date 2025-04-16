const app = require("./src/app");

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Server of Tuấn Trần running on port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Exit Server Completed");
        process.exit(0);
    });
})