const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai")

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `you are a bot that takes in privacy policies, you are to analyze those privacy policy and return a summary of the policies talking about the information the privacy policy says it collects from the users in easy to understand english language :     
     {

        status : success,
        
        title : //the name of the company/organization that the policy is talking about e.g spotify ,

        summary : [
        // an array of the data collected from the user in this format {
        
        title : spotify tracks your location data //a description about the data the policy collects,

        description : they track your location based on... // a descriptive description about what the privacy policy says they use your data for

        }]

        //the summary array should ONLY contain information about the data that is COLLECTED FROM THE USER and not about anything else
     }.
     
     If what you receive is not a privacy policy of any sort then return this : {
        status : error,
        reason : Message passed was not related to privacy policy, Please only send information about privacy policies
     }`,
})

const modelForPage = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `you are a bot that takes in HTML documents representing privacy policies, you are to analyze those privacy policy and return a summary of the policies talking about the information the privacy policy says it collects from the users in easy to understand english language and a reference to the html tag that talks about it :     
     {
        status : success,

        title : //the name of the company/organization that the policy is talking about e.g spotify ,

        summary : [
        // an array of the data collected from the user in this format {
        
        title : spotify tracks your location data //a description about the data the policy collects,

        description : they track your location based on... // a descriptive description about what the privacy policy says they use your data for,

        exactPhrase : We collect... //The exact phrase(provides from the HTML document) that talks about this privacy policy
        }]

        //the summary array should ONLY contain information about the data that is COLLECTED FROM THE USER and not about anything else
     }.
     
     If what you receive is not a privacy policy of any sort then return this : {
        status : error,
        reason : Message passed was not related to privacy policy, Please only send information about privacy policies
     }
     `,
})
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};
  
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

async function getPolicySummary(req, res){
    try{
        const {privacyPolicy} = req.body

        const chatSession = model.startChat({
          generationConfig,
          safetySettings,
          history: [
          ],
        })

        const messageSent = await chatSession.sendMessage(privacyPolicy)

        const messageResponse = JSON.parse(messageSent.response.text())

        if(messageResponse.status == "error"){
          return res.status(500).json(messageResponse)
        }

        res.json(messageResponse)
    }
    catch(err){
      res.status(500).json({status : "error", reason : "an error ocurred on the server"})
    }
}

async function getPolicySummaryFromPage(req, res){
    try{
        const {privacyPolicy} = req.body

        const chatSession = modelForPage.startChat({
          generationConfig,
          safetySettings,
          history: [
          ],
        })

        const messageSent = await chatSession.sendMessage(privacyPolicy)

        console.log(messageSent)

        const messageResponse = JSON.parse(messageSent.response.text())

        if(messageResponse.status == "error"){
          return res.status(500).json(messageResponse)
        }

        res.json(messageResponse)
    }
    catch(err){
        console.log(err)
        res.status(500).json({status : "error", reason : "an error ocurred on the server"})
    }
}

async function ping(req, res){
  try{
    res.status(200).send("ping received")
  }catch(err){
    res.status(500).send("an error ocurred")
    console.log("an error ocurred when app was trying to be pinged")
  }
}

module.exports = {getPolicySummary, getPolicySummaryFromPage, ping}