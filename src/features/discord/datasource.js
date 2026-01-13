const axios = require('axios');

exports.fetchDiscordServer = async () => {
    const serverCode = process.env.DISCORD_SERVER_CODE;
    const url = `https://discord.com/api/v10/invites/${serverCode}?with_counts=true`;
    const response = await axios.get(url, {
        headers: {
            'Accept': 'application/json',
        }
    }); 

    return response.data;
}
