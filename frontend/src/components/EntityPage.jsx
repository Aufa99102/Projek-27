import React, { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../utils/api";
import "../styles/EntityPage.css";

const buildInitialState = (fields) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.defaultValue || "";
    return accumulator;
  }, {});

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
}) {
  const [formData, setFormData] = useState(() => buildInitialState(fields));
  const [records, setRecords] = useState([]);
  const [ibuOptions, setIbuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const mappedRecords = useMemo(() => {
    if (!transformRecord) return records;

    return records.map((record) =>
      transformRecord(record, { ibuOptions })
    );
  }, [records, ibuOptions, transformRecord]);

  const displayedRecords = useMemo(() => {
    if (!filterRecords) return mappedRecords;

    return filterRecords(mappedRecords, { ibuOptions });
  }, [mappedRecords, ibuOptions, filterRecords]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const currentEditingId = editingId;
      const submittedData = { ...formData };
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

      if (Array.isArray(value)) {
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

  const shouldShowScrollHint = columns.length >= 10;

  return (
    <section className="entity-page">
      <div className="page-header">
        <div>
          <p className="page-overline">Modul Pelayanan</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="entity-grid">
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

          <form className="data-form" onSubmit={handleSubmit}>
            {fields.map((field) => {
              if (field.type === "select-ibu") {
                return (
                  <label key={field.name} className="form-group">
                    <span>{field.label}</span>
                    <select
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
                  </label>
                );
              }

              if (field.type === "textarea") {
                return (
                  <label key={field.name} className="form-group">
                    <span>{field.label}</span>
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                    />
                  </label>
                );
              }

              if (field.type === "select" && field.options) {
                return (
                  <label key={field.name} className="form-group">
                    <span>{field.label}</span>
                    <select
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
                  </label>
                );
              }

              return (
                <label key={field.name} className="form-group">
                  <span>{field.label}</span>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                  />
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

        <div className="panel-card">
          <h3>Daftar Data</h3>

          {renderTableControls ? (
            <div className="table-controls">
              {renderTableControls({
                records: mappedRecords,
                displayedRecords,
                ibuOptions,
              })}
            </div>
          ) : null}

          {shouldShowScrollHint ? (
            <p className="table-scroll-hint">
              Geser tabel ke kanan untuk melihat semua kolom data.
            </p>
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
                  {displayedRecords.map((record) => (
                    <tr key={record.id}>
                      {columns.map((col) => (
                        <td key={col.key}>{getCellContent(col, record)}</td>
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
      </div>
    </section>
  );
}

export default EntityPage;
