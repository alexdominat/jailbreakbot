const { Command } = require('discord.js-commando'),
        config = require("../../config")

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            group: 'announcements',
            memberName: 'announce',
            description: 'Announce firmware updates.Ex: !announce iOS 11.3 db 2 ',
			guildOnly: true,
            examples: ['!announce 11.3 db 2'],
            args: [{
                key: 'platform',
                prompt: 'Which platform\'s update are you going to announce?',
                type: 'string'
            },
            {
                key: 'iOS_Version',
                prompt: 'Which iOS version is the update?',
                type: 'string'
            },
            {
                key: 'beta',
                prompt: 'Is it a public ,developer beta or final version(pb or db or final)?',
                type: 'string',
                validate: key => key === 'pb' || key === 'db' || key === 'final'
            },
            {
                key: 'beta_version',
                prompt: 'Which version of beta?',
                type: 'integer'
            }
        
        ]
        });    
    }
hasPermission(msg) {
        return msg.member.roles.exists("id", config.administrator);
    }
    run(message, { platform, iOS_Version , beta , beta_version}) {
		message.delete().catch(console.error)
		const announcements = message.guild.channels.get(config.announcements)
		if (!announcements) return message.reply("I couldn't find the announcements channel.").then(e=>e.delete(3000))
		const role = message.guild.roles.find("name",platform)
		role.setMentionable(true).then(()=>{
            const string = `${role} ${iOS_Version} ${beta} ${beta_version} has been released!`
            announcements.send(string
                .replace("db","Developer Beta")
                .replace("pb","Public Beta")
                ).then(()=>{
                role.setMentionable(false)
            })
		})
    }
};

