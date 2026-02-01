const cron = require("../../utils/cron");
const router = require("express").Router();
const cache = require("../../utils/cache");
const service = require("./service");

// Init scheduled task
cron.eachHour(service.fetchDomadooAffiliation, "Domadoo");
cron.eachDay(service.fetchDomadooSales, "Domadoo sales");

// Launch domadoo sales if cache is empty
if (process.env.LAUNCH_AT_STARTUP === "true") {
  cache.get("domadoo-sales.json").then((data) => {
    if (data === null) {
      service.fetchDomadooSales().then(() => {
        service.fetchDomadooAffiliation();
      });
    } else {
      service.fetchDomadooAffiliation();
    }
  });
}

// Routes
router.get("/", async (req, res) => {
  try {
    const data = await service.fetchDomadooAffiliation();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des données Domadoo.",
    });
  }
});

router.get("/sales", async (req, res) => {
  try {
    await service.fetchDomadooSales();
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des données de vente Domadoo.",
    });
  }
});

router.get("/last", async (req, res) => {
  try {
    const cachedData = await cache.get("domadoo.json");
    if (cachedData) {
      res.json(cachedData);
    } else {
      res.status(404).json({ error: "Aucune donnée en cache trouvée." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des données en cache.",
    });
  }
});

module.exports = router;
