const datasource = require('./datasource');
const cache = require('../../utils/cache');

exports.fetchDiscordData = async () => {
    const data = await datasource.fetchDiscordServer();

    const result = {
        name: data.profile.name,
        members: data.profile.member_count,
        members_online: data.profile.online_count,
        lastUpdate: new Date().toISOString(),
    }

    cache.set(result, 'discord.json');
    return result
}