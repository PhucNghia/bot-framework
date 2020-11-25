const request = require('request');
var schedule = require('node-schedule');
const restify = require('restify');
const botbuilder = require('botbuilder');

// Bot-mini
var adapter = new botbuilder.BotFrameworkAdapter({
  appId: "a27f1a12-e74a-40cb-8141-479c794a9316",
  appPassword: "GpdWQ9c075.lVEI_ln-ZAQm9wX_AsD3sy5"
});

// Create HTTP server
let server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 7070, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});

var requestInfo = null;
var responseInfo = null;

// Listen for incoming requests at /api/messages.
server.post('/api/messages', (req, res) => {
  requestInfo = req;
  responseInfo = res;
  adapter.processActivity(req, res, async (turnContext) => {
    let activity = turnContext.activity;
    console.log(new Date() + ": activity type: " + activity.type);
    switch(activity.type) {
      case "conversationUpdate":
        try {
          // await turnContext.sendActivity("Xin chào cả nhà!");
          // await turnContext.sendActivity("Em là bot mới đc tạo. Em qua đây để giúp mọi người nhớ thời gian log work vào Thứ 5 hàng tuần ạ. Em sẽ nhắc mọi người vào 9h và 16h ạ (happyeyes)");
          console.log(new Date() + ": Add bot to group");
        } catch (error) {
          requestInfo = responseInfo = null;
          console.log(new Date() + ": Removed this Bot");
        }
        break;
      case "message":
        const utterance = activity.text;
        if(utterance !== "reminder reload") {
          await turnContext.sendActivity(`Chúc bạn một ngày tốt lành (happyeyes). Mình đã nghe thấy bạn nói: ${ utterance.replace('reminder ', '') }`);
          console.log(new Date() + ": Replied");
        } else {
          console.log(new Date() + ": Bot is Reloaded");
        }
        break;
      default:
        break;
    }
  });
});

// ========================================================

server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));

server.get('/', (req, res) => {
  res.send("Hello");
});

// var cronExpress = '*/15 * * * * * *';  // 15s chạy 1 lần
// var cronExpress = '0 5 8 * * THU';     // 8h30p thứ năm hàng tuần
var cronExpressMorning = '0 30 08 * * THU';
var cronExpressAfternoon = '0 00 16 * * THU';
var cronExpress = '*/10 * * * * * *';  // 15s chạy 1 lần

// schedule.scheduleJob(cronExpress, function(fireDate) {
//   let content = "test";
//   processJob(content);
//   console.log("send content is empty: " + fireDate);
// });

schedule.scheduleJob(cronExpressMorning, function(fireDate) {
  let content = "Hôm nay là thứ 5 rồi. Cả nhà log work nhé (happyface)";
  processJob(content);
  console.log("run schedule morning: " + fireDate);
});

schedule.scheduleJob(cronExpressAfternoon, function(fireDate) {
  let content = "Sắp tới giờ về rồi. Cả nhà đừng quên log work nhé (sweatgrinning)";
  processJob(content);
  console.log("run schedule afternoon: " + fireDate);
});

var processJob = function(content) {
  if(requestInfo == null || responseInfo == null) {
    return;
  }
  try {
    request.post('http://localhost:7070/api/notification', {form: {content: content}})  
  } catch (error) {
    console.log(new Date() + ": Job is has error");  
  }
  
}

server.post('/api/notification', (req, res) => {
  let content = req.body.content;
  console.log(new Date() + ": Content: " + content);
  try {
    adapter.processActivity(requestInfo, responseInfo, async (turnContext) => {
      await turnContext.sendActivity(content);
    });
    res.send("sent: " + content);
  } catch (error) {
    console.log(new Date() + ": Removed this Bot. request and response are null");
    res.send("Removed this Bot. request and response are null");
  }
});
