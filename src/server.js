require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")

const AppError = require("./utils/AppError")

//Importando o express
const express = require("express")

const routes = require("./routes")
migrationsRun()

//Inicializando o express
const app = express()
app.use(express.json())

app.use(routes)

//tratando a exceção
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
})

//Definindo o número da porta
const PORT = 3333

//escutando quando o serviço iniciar, irá emitir uma mensagem no console
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
