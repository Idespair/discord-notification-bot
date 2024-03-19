import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { google } from "googleapis";
import { schedule } from "node-cron";

config();

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
})

const youtubeClient = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
})

let latestVideoId = ""

discordClient.login(process.env.DISCORD_TOKEN)

discordClient.on('ready', () =>{
    console.log("Bot online!")
    console.log(`logged as: ${discordClient.user.tag}`)
    checkNewVideos();

    schedule("0 * * * ", )
})

async function checkNewVideos(){
    try {
        const response = await youtubeClient.search.list({
            channelId: "UCsBjURrPoezykLs9EqgamOA",
            order: 'date',
            part: 'snippet',
            type: 'video',
            maxResults: 1
        }).then(res => res)
        const latestVideo = response.data.items[0]
        
        if(latestVideo?.id?.videoId != latestVideoId){
            latestVideoId = latestVideo?.id?.videoId
            const videoUrl = `https://www.youtube.com/${latestVideoId} `
            const message = "Check fireship last video!"
            const channel = discordClient.channels.cache.get('1219395755119345705')
            channel.send(message + videoUrl)
        }
    } catch (error){
        console.log("Error finding fireship's last video!")
        console.log(error)
    }
}