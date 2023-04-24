const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Baneare a un usuario que menciones")
    .addUserOption((option) => option.setName(`target`).setDescription(`Usuario a Banear`).setRequired(true))
    .addStringOption((option) => option.setName(`motivo`).setDescription(`Motivo del Ban`))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    ,async execute(interaction, client) {
        const user = interaction.options.getUser(`target`); 
        const {guild} = interaction;

        let razon = interaction.options.getString(`motivo`);
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

    if (!razon) razon = "No hay motivo";
    if(user.id === interaction.user.id) return interaction.reply({content: `No puedes banearte a ti mismo`, ephemeral: true});
    if(user.id === client.user.id) return interaction.reply({content: `No puedes banearme a mi, tengo super poderes`, ephermal: false})
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: `No puedes banear a alguien con un role igual o superior al tuyo`, ephemeral: false});
    if(!member.kickable) return interaction.reply({content: `No puedo banear a alguien con un rol igual o superior al mio`})

    const embed= new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL({dynamic:true})}` })
        .setTitle(`${user.tag} ha sido baneado del servidor`)
        .setColor(`#ff0000`)
        .setTimestamp()
        .setThumbnail(`${user.displayAvatarURL({dynamic: true})}`)
        .addFields({ name: `Motivo`, value: `${razon}`});
    
        await member.ban({deleteMessageSeconds: 0, reason: razon})
        .catch(console.error);
        
        interaction.reply({embeds: [embed]});

    },
}