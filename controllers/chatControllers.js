const dialogflow = require("@google-cloud/dialogflow");

// const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const PROJECTID = process.env.CREDENTIALS_project_id;

const CONFIGURATION = {
    credentials: {
        private_key: process.env.CREDENTIALS_private_key,
        client_email: process.env.CREDENTIALS_client_email
    }
}
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionid) => {
    let sessionPath = sessionClient.projectAgentSessionPath(PROJECTID, sessionid);

    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode
            }
        } 
    };

    const responses = await sessionClient.detectIntent(request);
    // console.log(responses);
    const result = responses[0].queryResult;
    // console.log(result);
    return {
        replyText: result.fulfillmentText,
        intentName: result.intent.displayName
    }
}

exports.getMessageReply = async (req,res)=>{

    console.log(req.body);

    const reply = await detectIntent("en", req.body.message, "abcd123");
    // const reply = {
    //     replyText: "This is a default response please try to activate Dialogflow chatbot",
    //     intentType: "service-near-me"
    // }

    res.json(reply)
}