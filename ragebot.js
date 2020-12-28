const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const fetch = require('node-fetch');

let settings = {method: "Get"};
let items;

function readItemData() {
  fs.readFile('items.json', (err, data) => {
      if (err) throw err;
      items = JSON.parse(data);
      //console.log("Read in " + items.length + " items.")
  });
}

//try {
//	var token = fs.readFileSync('token.txt', 'utf8');
//} catch {
	//error
//}

client.login(config.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  readItemData();
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
        msg.channel.send("Price: " + json[0].sell_price_min + " in " + json[0].city);
      });
      break;
  case("get") :
    if(args[0]) {
      var name = args[0];
    } else {
      msg.channel.send("Please enter item name");
    }

    var unique;
    var poss = "Possibilities: "


    for(let i = 0; i < items.length-1; i++) {
      if(items[i].LocalizedNames) {
        if(items[i].UniqueName === name) {
          //var url = "https://www.albion-online-data.com/api/v2/stats/prices/" + name + "?locations=FortSterling&qualities=0";
          var url = "https://www.albion-online-data.com/api/v2/stats/prices/" + name + "?locations=FortSterling,Lymhurst,Bridgewatch,Martlock,Thetford,Carleon";
          fetch(url, settings)
          .then(res => res.json())
          .then((json) => {
              json.sort(function(a, b) {
                return a.sell_price_min - b.sell_price_min;
              });
            msg.channel.send("Price " + json[0].LocalizedNames["EN-US"] + ": " + json[0].sell_price_min + " in " + json[0].city);
          });
          poss = [];
          //return;
          break;
        } else if (items[i].LocalizedNames["EN-US"].toLowerCase().indexOf(name.toLowerCase()) !== -1) {
            poss = poss + items[i].UniqueName + "\n";
          }
        }
      }
    if(poss.length > 17) {
      msg.channel.send(poss);
    }

    break;
  }
});
