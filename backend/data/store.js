const createCollection = () => ({
  items: [],
  nextId: 1,
});

const collections = {
  ibu: createCollection(),
  kehamilan: createCollection(),
  lab: createCollection(),
  persalinan: createCollection(),
  rencana: createCollection(),
  pemeriksaan: createCollection(),
  usg: createCollection(),
  edukasi: createCollection(),
};

const activityLog = [];
const MAX_ACTIVITY = 10;

const getItems = (key) => collections[key].items;

const findItemById = (key, id) =>
  collections[key].items.find((item) => String(item.id) === String(id));

const createItem = (key, payload) => {
  const collection = collections[key];
  const newItem = {
    id: collection.nextId++,
    ...payload,
  };

  collection.items.push(newItem);
  return newItem;
};

const updateItem = (key, id, payload) => {
  const collection = collections[key];
  const itemIndex = collection.items.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (itemIndex === -1) {
    return null;
  }

  const updatedItem = {
    ...collection.items[itemIndex],
    ...payload,
    id: collection.items[itemIndex].id,
  };

  collection.items[itemIndex] = updatedItem;
  return updatedItem;
};

const deleteItem = (key, id) => {
  const collection = collections[key];
  const itemIndex = collection.items.findIndex(
    (item) => String(item.id) === String(id)
  );

  if (itemIndex === -1) {
    return null;
  }

  const [deletedItem] = collection.items.splice(itemIndex, 1);
  return deletedItem;
};

const findIbuById = (ibuId) =>
  collections.ibu.items.find((item) => String(item.id) === String(ibuId));

const addActivity = (message) => {
  activityLog.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    message,
    timestamp: new Date().toISOString(),
  });

  if (activityLog.length > MAX_ACTIVITY) {
    activityLog.pop();
  }
};

const getDashboardSummary = () => ({
  total_ibu: collections.ibu.items.length,
  total_pemeriksaan: collections.pemeriksaan.items.length,
  total_usg: collections.usg.items.length,
  recent_activity: activityLog,
});

module.exports = {
  addActivity,
  createItem,
  deleteItem,
  findIbuById,
  findItemById,
  getDashboardSummary,
  getItems,
  updateItem,
};
