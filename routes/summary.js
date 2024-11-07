const express = require("express")
const { getPolicySummary } = require("../controllers/summary")

summaryRouter = express.Router()

summaryRouter.post("/", getPolicySummary)

module.exports = summaryRouter