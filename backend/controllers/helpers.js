const {db} = require("../config/db");

const normalizeArrayField = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const validateIbuRelation = async (ibuId) => {
  if (!ibuId) {
    return "Field ibu_id wajib diisi.";
  }

  const query = "SELECT id FROM ibu WHERE id = ?";
  const [rows] = await db.execute(query, [ibuId]);

  if (rows.length === 0) {
    return "Data ibu tidak ditemukan untuk ibu_id tersebut.";
  }

  return null;
};

const isBlank = (value) =>
  value === null || value === undefined || String(value).trim() === "";

const padTwoDigits = (value) => String(value).padStart(2, "0");

const extractDateParts = (value) => {
  if (isBlank(value)) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return {
      day: padTwoDigits(value.getDate()),
      month: padTwoDigits(value.getMonth() + 1),
      year: String(value.getFullYear()),
    };
  }

  const stringValue = String(value).trim();
  const dayFirstMatch = stringValue.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dayFirstMatch) {
    const [, day, month, year] = dayFirstMatch;
    return { day, month, year };
  }

  const yearFirstMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (yearFirstMatch) {
    const [, year, month, day] = yearFirstMatch;
    return { day, month, year };
  }

  const parsedDate = new Date(stringValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    day: padTwoDigits(parsedDate.getDate()),
    month: padTwoDigits(parsedDate.getMonth() + 1),
    year: String(parsedDate.getFullYear()),
  };
};

const normalizeDateForDatabase = (value) => {
  const parts = extractDateParts(value);

  if (!parts) {
    return null;
  }

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const formatDateForClient = (value) => {
  const parts = extractDateParts(value);

  if (!parts) {
    return "";
  }

  return `${parts.day}-${parts.month}-${parts.year}`;
};

const normalizeDateFieldsForClient = (record, dateFields) =>
  dateFields.reduce(
    (normalizedRecord, fieldName) => ({
      ...normalizedRecord,
      [fieldName]: formatDateForClient(normalizedRecord[fieldName]),
    }),
    { ...record }
  );

const normalizeRowsDateFieldsForClient = (rows, dateFields) =>
  rows.map((row) => normalizeDateFieldsForClient(row, dateFields));

module.exports = {
  normalizeArrayField,
  validateIbuRelation,
  isBlank,
  normalizeDateForDatabase,
  formatDateForClient,
  normalizeDateFieldsForClient,
  normalizeRowsDateFieldsForClient,
};
