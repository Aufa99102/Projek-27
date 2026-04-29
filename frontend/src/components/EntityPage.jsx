import React, { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../utils/api";
import "../styles/EntityPage.css";

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const buildInitialState = (fields) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.defaultValue || "";
    return accumulator;
  }, {});

const validateFormData = (fields, formData) =>
  fields.reduce((errors, field) => {
    const rawValue = formData[field.name];
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
    const isEmptyValue = value === "" || value === null || value === undefined;

    if (field.required && isEmptyValue) {
      errors[field.name] = `${field.label} wajib diisi.`;
      return errors;
    }

    if (!isEmptyValue && field.textOnly && /\d/.test(String(value))) {
      errors[field.name] = `${field.label} hanya boleh berisi huruf.`;
      return errors;
    }

    if (!isEmptyValue && (field.numericOnly || field.type === "number" || field.inputMode === "numeric")) {
      const normalizedValue = String(value).replace(",", ".").trim();
      const numericPattern = field.allowDecimal
        ? /^\d+([.]\d+)?$/
        : /^\d+$/;

      if (!numericPattern.test(normalizedValue)) {
        errors[field.name] = field.allowDecimal
          ? `${field.label} hanya boleh berisi angka.`
          : `${field.label} hanya boleh berisi angka tanpa huruf.`;
        return errors;
      }
    }

    if (typeof field.validate === "function") {
      const validationMessage = field.validate(rawValue, formData);

      if (validationMessage) {
        errors[field.name] = validationMessage;
      }
    }

    return errors;
  }, {});

const extractDateParts = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    const dayFirstMatch = trimmedValue.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (dayFirstMatch) {
      const [, day, month, year] = dayFirstMatch;
      return { day, month, year };
    }

    const indonesianMonthMatch = trimmedValue.match(
      /^(\d{2})\s+([A-Za-z]+)\s+(\d{4})$/
    );
    if (indonesianMonthMatch) {
      const [, day, monthLabel, year] = indonesianMonthMatch;
      const monthIndex = INDONESIAN_MONTHS.findIndex(
        (month) => month.toLowerCase() === monthLabel.toLowerCase()
      );

      if (monthIndex >= 0) {
        return {
          day,
          month: String(monthIndex + 1).padStart(2, "0"),
          year,
        };
      }
    }

    const isoLikeMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    if (isoLikeMatch) {
      const [, year, month, day] = isoLikeMatch;
      return { day, month, year };
    }
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    day: String(parsedDate.getUTCDate()).padStart(2, "0"),
    month: String(parsedDate.getUTCMonth() + 1).padStart(2, "0"),
    year: String(parsedDate.getUTCFullYear()),
  };
};

const normalizeDate = (value) => {
  const parts = extractDateParts(value);

  if (!parts) {
    return "";
  }

  return `${parts.day}-${parts.month}-${parts.year}`;
};

const formatDisplayDate = (value) => {
  const parts = extractDateParts(value);

  if (!parts) {
    return "";
  }

  const monthLabel = INDONESIAN_MONTHS[Number(parts.month) - 1];

  return monthLabel ? `${parts.day} ${monthLabel} ${parts.year}` : "";
};

const toDateInputValue = (value) => {
  const parts = extractDateParts(value);

  if (!parts) {
    return "";
  }

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const normalizeRecordDateFields = (record, fields, formatter = formatDisplayDate) =>
  fields.reduce((normalizedRecord, field) => {
    if (field.type !== "date" || !(field.name in normalizedRecord)) {
      return normalizedRecord;
    }

    return {
      ...normalizedRecord,
      [field.name]: formatter(normalizedRecord[field.name]),
    };
  }, { ...record });

const attachIbuName = (record, ibuOptions) => {
  if (!record || record.ibu_id === null || record.ibu_id === undefined) {
    return record;
  }

  const ibu = ibuOptions.find((item) => String(item.id) === String(record.ibu_id));

  return {
    ...record,
    ibu_nama: ibu?.nama || record.ibu_nama || `Ibu ID ${record.ibu_id}`,
  };
};

function EntityPage({
  title,
  description,
  endpoint,
  fields,
  columns,
  requireIbuOptions = true,
  transformRecord,
  filterRecords,
  renderTableControls,
  onSuccess,
  renderRowActions,
  separateViews = false,
  defaultView = "table",
}) {
  const [formData, setFormData] = useState(() => buildInitialState(fields));
  const [records, setRecords] = useState([]);
  const [ibuOptions, setIbuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [clientErrors, setClientErrors] = useState({});
  const [activeView, setActiveView] = useState(defaultView);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const requests = [fetchJson(endpoint)];

      if (requireIbuOptions) {
        requests.push(fetchJson("/ibu"));
      }

      const [recordResponse, ibuResponse] = await Promise.all(requests);
      const nextRecords = recordResponse.data || [];
      const nextIbuOptions = ibuResponse?.data || [];

      setRecords(nextRecords);
      setIbuOptions(nextIbuOptions);

      return {
        records: nextRecords,
        ibuOptions: nextIbuOptions,
      };
    } catch (requestError) {
      setError(requestError.message);
      return {
        records: [],
        ibuOptions: [],
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint, requireIbuOptions]);

  const normalizedRecords = useMemo(
    () =>
      records.map((record) =>
        normalizeRecordDateFields(attachIbuName(record, ibuOptions), fields)
      ),
    [records, fields, ibuOptions]
  );

  const mappedRecords = useMemo(() => {
    if (!transformRecord) return normalizedRecords;

    return records.map((record) =>
      normalizeRecordDateFields(
        attachIbuName(transformRecord(record, { ibuOptions }), ibuOptions),
        fields
      )
    );
  }, [records, normalizedRecords, ibuOptions, transformRecord, fields]);

  const displayedRecords = useMemo(() => {
    if (!filterRecords) return mappedRecords;

    return filterRecords(mappedRecords, { ibuOptions });
  }, [mappedRecords, ibuOptions, filterRecords]);

  const handleChange = (event) => {
    const { name } = event.target;
    const field = fields.find((item) => item.name === name);
    let { value } = event.target;

    if (field?.numericOnly || field?.inputMode === "numeric" || field?.type === "number") {
      value = field.allowDecimal
        ? value
            .replace(/,/g, ".")
            .replace(/[^\d.]/g, "")
            .replace(/(\..*)\./g, "$1")
        : value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setClientErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateFormData(fields, formData);

    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      setError("");
      setSuccessMessage("");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");
    setClientErrors({});

    try {
      const currentEditingId = editingId;
      const submittedData = fields.reduce((accumulator, field) => {
        const value = formData[field.name];

        accumulator[field.name] =
          field.type === "date" ? normalizeDate(value) : value;

        return accumulator;
      }, {});
      const method = currentEditingId ? "PUT" : "POST";
      const url = currentEditingId ? `${endpoint}/${currentEditingId}` : endpoint;

      const response = await fetchJson(url, {
        method,
        body: JSON.stringify(submittedData),
      });

      const refreshedData = await loadData();
      const latestSavedRecord =
        refreshedData.records.find((record) => {
          if (currentEditingId) {
            return String(record.id) === String(currentEditingId);
          }

          if ("nik" in submittedData && submittedData.nik) {
            return String(record.nik) === String(submittedData.nik);
          }

          return false;
        }) ||
        response?.data ||
        submittedData;

      setFormData(buildInitialState(fields));
      setEditingId(null);
      setClientErrors({});
      if (separateViews) {
        setActiveView("table");
      }

      setSuccessMessage(
        currentEditingId ? "Data berhasil diperbarui." : "Data berhasil disimpan."
      );

      if (onSuccess) {
        onSuccess(latestSavedRecord, {
          isEditing: Boolean(currentEditingId),
        });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    const newForm = fields.reduce((acc, field) => {
      const value = record[field.name];

      if (field.type === "date") {
        acc[field.name] = toDateInputValue(value);
      } else if (Array.isArray(value)) {
        acc[field.name] = value.join(", ");
      } else if (value === null || value === undefined) {
        acc[field.name] = "";
      } else {
        acc[field.name] = String(value);
      }

      return acc;
    }, {});

    setFormData(newForm);
    setEditingId(record.id);
    setError("");
    setSuccessMessage("");
    setClientErrors({});
    if (separateViews) {
      setActiveView("form");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      await fetchJson(`${endpoint}/${id}`, { method: "DELETE" });

      if (editingId === id) {
        setEditingId(null);
        setFormData(buildInitialState(fields));
      }

      setSuccessMessage("Data berhasil dihapus.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(buildInitialState(fields));
    setError("");
    setSuccessMessage("");
    setClientErrors({});
    if (separateViews) {
      setActiveView("table");
    }
  };

  const renderCellValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return value;
  };

  const getCellContent = (column, record) => {
    if (typeof column.render === "function") {
      return column.render(record);
    }

    return renderCellValue(record[column.key]);
  };

  const showFormPanel = !separateViews || activeView === "form";
  const showTablePanel = !separateViews || activeView === "table";

  return (
    <section className="entity-page">
      <div className="page-header">
        <div>
          <p className="page-overline">Modul Pelayanan</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {separateViews ? (
        <div className="entity-view-switcher">
          <button
            type="button"
            className={activeView === "table" ? "entity-view-button active" : "entity-view-button"}
            onClick={() => setActiveView("table")}
          >
            Daftar Data
          </button>
          <button
            type="button"
            className={activeView === "form" ? "entity-view-button active" : "entity-view-button"}
            onClick={() => setActiveView("form")}
          >
            {editingId ? "Edit Data" : "Form Input"}
          </button>
        </div>
      ) : null}

      <div className={separateViews ? "entity-grid entity-grid-single" : "entity-grid"}>
        {showFormPanel ? (
          <div className="panel-card">
            <div className="panel-heading">
              <h3>{editingId ? "Edit Data" : "Form Input"}</h3>
              {editingId && (
                <button onClick={handleCancelEdit} className="secondary-button">
                  Batal Edit
                </button>
              )}
            </div>

            {error && <div className="alert error">{error}</div>}
            {successMessage && <div className="alert success">{successMessage}</div>}
            {Object.keys(clientErrors).length > 0 ? (
              <div className="alert error form-errors">
                <strong>Periksa kembali form berikut:</strong>
                <ul>
                  {Object.values(clientErrors).map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <form className="data-form" onSubmit={handleSubmit}>
              {fields.map((field) => {
                if (field.type === "select-ibu") {
                  return (
                    <label key={field.name} className="form-group">
                      <span>{field.label}</span>
                      <select
                        className={clientErrors[field.name] ? "input-error" : ""}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="">Pilih ibu</option>
                        {ibuOptions.map((ibu) => (
                          <option key={ibu.id} value={ibu.id}>
                            {ibu.nama}
                          </option>
                        ))}
                      </select>
                      {clientErrors[field.name] ? (
                        <small className="field-error">{clientErrors[field.name]}</small>
                      ) : null}
                    </label>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <label key={field.name} className="form-group">
                      <span>{field.label}</span>
                      <textarea
                        className={clientErrors[field.name] ? "input-error" : ""}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                      {clientErrors[field.name] ? (
                        <small className="field-error">{clientErrors[field.name]}</small>
                      ) : null}
                    </label>
                  );
                }

                if (field.type === "select" && field.options) {
                  return (
                    <label key={field.name} className="form-group">
                      <span>{field.label}</span>
                      <select
                        className={clientErrors[field.name] ? "input-error" : ""}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="">Pilih</option>
                        {field.options.map((option) => {
                          if (typeof option === "string") {
                            return (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            );
                          }

                          return (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          );
                        })}
                      </select>
                      {clientErrors[field.name] ? (
                        <small className="field-error">{clientErrors[field.name]}</small>
                      ) : null}
                    </label>
                  );
                }

                return (
                  <label key={field.name} className="form-group">
                    <span>{field.label}</span>
                    <input
                      type={field.type || "text"}
                      className={clientErrors[field.name] ? "input-error" : ""}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                    />
                    {clientErrors[field.name] ? (
                      <small className="field-error">{clientErrors[field.name]}</small>
                    ) : null}
                  </label>
                );
              })}

              <button type="submit" disabled={submitting} className="primary-button">
                {submitting
                  ? "Menyimpan..."
                  : editingId
                  ? "Update Data"
                  : "Simpan Data"}
              </button>
            </form>
          </div>
        ) : null}

        {showTablePanel ? (
          <div className="panel-card">
            <div className="panel-heading">
              <h3>Daftar Data</h3>
              {separateViews ? (
                <button
                  type="button"
                  className="primary-button entity-add-button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(buildInitialState(fields));
                    setClientErrors({});
                    setError("");
                    setSuccessMessage("");
                    setActiveView("form");
                  }}
                >
                  Tambah Data
                </button>
              ) : null}
            </div>

            {renderTableControls ? (
              <div className="table-controls">
                {renderTableControls({
                  records: mappedRecords,
                  displayedRecords,
                  ibuOptions,
                })}
              </div>
            ) : null}

            {loading ? (
              <p>Loading...</p>
            ) : displayedRecords.length === 0 ? (
              <p>Belum ada data yang dapat ditampilkan.</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRecords.map((record, rowIndex) => (
                      <tr key={record.id}>
                        {columns.map((col, columnIndex) => (
                          <td key={`${col.key}-${columnIndex}`}>
                            {col.key === "nomor"
                              ? rowIndex + 1
                              : getCellContent(col, record)}
                          </td>
                        ))}
                        <td>
                          <div className="action-buttons">
                            {renderRowActions ? renderRowActions(record) : null}
                            <button
                              type="button"
                              className="table-button edit"
                              onClick={() => handleEdit(record)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="table-button delete"
                              onClick={() => handleDelete(record.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default EntityPage;
