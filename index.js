import { getUser, addYap, updateUser } from "./db.js";

// Example: When someone types "!yaps"
client.on("message", async msg => {
  if (msg.body.startsWith("!yaps")) {
    const username = msg.body.split(" ")[1];
    const user = getUser(username);
    msg.reply(`${username} has ${user.yaps} yaps and is ${user.innerCT ? "an Inner CT" : "not an Inner CT"}.`);
  }

  if (msg.body.startsWith("!addyap")) {
    const username = msg.body.split(" ")[1];
    addYap(username);
    msg.reply(`Yap added for ${username}.`);
  }
});
