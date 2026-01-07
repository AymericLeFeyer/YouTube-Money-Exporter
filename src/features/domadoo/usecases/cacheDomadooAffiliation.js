const { set } = require('../../../utils/cache');

exports.cacheDomadooAffiliation = async (affiliationData) => {
    set(affiliationData, 'domadooAffiliation.json', '../features/domadoo/cache');
};