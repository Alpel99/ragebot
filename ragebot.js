const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
//const fs = require('fs');
const fetch = require('node-fetch');

let settings = {method: "Get"};

fs.readFile('items.json', (err, data) => {
    if (err) throw err;
    let items = JSON.parse(data);
});

//try {
//	var token = fs.readFileSync('token.txt', 'utf8');
//} catch {
	//error
//}

client.login(config.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  //dont answer our own messages
  if (msg.author.bot) return;
  //Checking for prefix
  if (msg.content.indexOf(config.prefix) !== 0) return;
  //get input data
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //react to commands
  switch (command) {
    case("ping") :
      msg.reply('Pong!');
      break;
    case("gettest") :
      var url = "https://www.albion-online-data.com/api/v2/stats/prices/T4_BAG@3?locations=FortSterling&qualities=2";
      fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        msg.channel.send('Price: ' + json[0].sell_price_min);
      });
      break;
  case("get") :
    var city = args[0];
    //var item = agrs[1];
    //var quality = args[2];
    for(let i = 0; i < items.length; i++) {
      for(var names in i.LocalizedNames){
        if (names.toLowerCase().indexOf(city.toLowerCase()) === -1) {
          console.log(name + ": " + i.LocalizationNameVariable);
        }
      }
    }/*
    var url = "https://www.albion-online-data.com/api/v2/stats/prices/T4_BAG@3?locations=FortSterling&qualities=2";
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      msg.channel.send('Price: ' + json[0].sell_price_min);
    });*/
    break;
  }
}
});


/* OLD TEST
function getJson(url) {
	 fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
		console.log("JSON: " + json[0]);
		return json;
    });
}*/
