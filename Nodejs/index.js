const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./db/DBConnection')
connectDB()

const { loadEnvFile } = require('node:process')
loadEnvFile()

console.log(process.env.JWT_SECRET)

const todoRouter = require('./routers/todoRouter')
const userRouter = require('./routers/userRouter');
const { authMiddleware } = require('./middleware/auth');

app.use(express.json())
app.use('/api/todos',authMiddleware,todoRouter)
app.use('/api/users',userRouter)


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;