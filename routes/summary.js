const express = require("express")
const { getPolicySummary, getPolicySummaryFromPage, ping } = require("../controllers/summary")
const cors = require("cors")

const whitelist = ['chrome-extension://doapfofebjnljdcdpkknadbnojikkokp']

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

summaryRouter = express.Router()

summaryRouter.post("/", cors(corsOptions), getPolicySummary)

summaryRouter.post("/page", cors(corsOptions), getPolicySummaryFromPage)

summaryRouter.get("/ping", ping)

module.exports = summaryRouter