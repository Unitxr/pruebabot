const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Dare timeout a un usuario que menciones")
    .addUserOption((option) => option.setName(`target`).setDescription(`Usuario a dar timeout`).setRequired(true)
    )
    .addIntegerOption((option) => option.setName(`tiempo`).setDescription(`Tiempo del timeout en minutos`).setRequired (true))
    .addStringOption((option) => option.setName(`motivo`).setDescription(`Motivo del timeout`))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    ,async execute(interaction, client) {
        const user = interaction.options.getUser(`target`);
        const tiempo = interaction.options.getInteger(`tiempo`)
        const {guild} = interaction;

        let razon = interaction.options.getString(`motivo`);
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

    if (!razon) razon = "No hay motivo";
    if(user.id === interaction.user.id) return interaction.reply({content: `No puedes darte timeout a ti mismo`, ephemeral: true});
    if(user.id === client.user.id) return interaction.reply({content: `No puedes darme timeout a mi, tengo super poderes`, ephermal: false})
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: `No puedes dar timeout a alguien con un role igual o superior al tuyo`, ephemeral: false});
    if(!member.kickable) return interaction.reply({content: `No puedo dar timeput a alguien con un rol igual o superior al mio`});
    if(tiempo > 10000) return interaction.reply({content : `El tiempo no puede superar los 10.000 minutos`, ephemeral: true});

    const embed= new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL({dynamic:true}) ||
        "https://cdn.discordapp.com/attachments/1053464482095050803/1053464952607875072/PRywUXcqg0v5DD6s7C3LyQ.png"}` })
        .setTitle(`${user.tag} ha sido timeouted del servidor`)
        .setColor(`#ff0000`)
        .setTimestamp()
        .setThumbnail(`${user.displayAvatarURL({dynamic: true})}`)
        .addFields({ name: `Motivo`, value: `${razon}`, inline: true}, {name: `Tiempo`, value: `${tiempo}`, inline: true});
    
        await member.timeout(tiempo* 60 * 1000, razon).catch(console.error);
        
        interaction.reply({embeds: [embed]});

    },
}