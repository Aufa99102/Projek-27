const { getDashboardSummary } = require("../data/store");

const getDashboard = (req, res) => {
  res.json(getDashboardSummary());
};

module.exports = {
  getDashboard,
};
