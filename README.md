# Scheduler

[
![](https://img.shields.io/docker/v/theaninova/discord-planner?label=Docker%20Image&logo=docker&logoColor=white&style=flat)
](https://hub.docker.com/repository/docker/theaninova/discord-planner)
[
![](https://img.shields.io/website?color=5865f2&label=Discord%20Bot&logo=discord&logoColor=white&flat&up_message=Invite&url=https%3A%2F%2Fdiscord.com%2Fapi%2Foauth2%2Fauthorize%3Fclient_id%3D980874521722646548%26permissions%3D277025523712%26scope%3Dbot%2520applications.commands)
](https://discord.com/api/oauth2/authorize?client_id=980874521722646548&permissions=277025523712&scope=bot%20applications.commands)

Fun and easy bot to coordinate events.

[![](./demo/demo.gif)](https://discord.com/api/oauth2/authorize?client_id=980874521722646548&permissions=277025523712&scope=bot%20applications.commands)

Doesn't have any security features, but it's easy to use. Don't use
this on a public server as anyone can add and remove events.

The bot will also probably break if you're creating events from a different
timezone than the bot is running in (Berlin, in this case) and the dates
will be off by a few hours.

## Environment Variables

```dotenv
CLIENT_ID=12345
TOKEN=AbC12dEf34g56h78i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
# Commands can take a while to propagate, if you add your server id here
# it will use server commands in addition which are updated instantly.
TEST_GUILD_ID=123456789
# This one is if you deploy it with Docker
TZ=Europe/Berlin
```
