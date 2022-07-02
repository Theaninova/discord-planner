# Scheduler

![](https://img.shields.io/docker/v/theaninova/discord-planner?label=Docker%20Image&logo=docker&logoColor=white&style=for-the-badge)

Fun and easy bot to coordinate events.

[![](./demo/demo.gif)](https://discord.com/api/oauth2/authorize?client_id=980874521722646548&permissions=277025523712&scope=bot%20applications.commands)

Doesn't have any security features, but it's easy to use. Don't use
this on a public server as anyone can add and remove events.

[Invite](https://discord.com/api/oauth2/authorize?client_id=980874521722646548&permissions=277025523712&scope=bot%20applications.commands)

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
