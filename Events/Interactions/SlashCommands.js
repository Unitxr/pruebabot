const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if(!command)
        return interaction.reply({
            content: "This Command is outdated",
            ephermal: true,
        });

        if (command.developer && interaction.user.id !== "1059128467104465047")
        return interaction.reply({
            content: "Este comando solo lo puede utilizar el desarrollador",
            ephermal: true,
        });

        command.execute(interaction, client);
    }
}
