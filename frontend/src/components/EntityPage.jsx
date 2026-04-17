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
      setRecords(recordResponse);
      setIbuOptions(ibuResponse || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [endpoint, requireIbuOptions]);

  const mappedRecords = useMemo(() => {
    if (!transformRecord) {
      return records;
    }

    return records.map((record) =>
      transformRecord(record, {
        ibuOptions,
      })
    );
  }, [ibuOptions, records, transformRecord]);

  const displayedRecords = useMemo(() => {
    if (!filterRecords) {
      return mappedRecords;
    }

    return filterRecords(mappedRecords, {
      ibuOptions,
    });
  }, [filterRecords, ibuOptions, mappedRecords]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const requestMethod = editingId ? "PUT" : "POST";
      const requestEndpoint = editingId ? `${endpoint}/${editingId}` : endpoint;

      await fetchJson(requestEndpoint, {
        method: requestMethod,
        body: JSON.stringify(formData),
      });

      setFormData(buildInitialState(fields));
      setEditingId(null);
      setSuccessMessage(
        editingId ? "Data berhasil diperbarui." : "Data berhasil disimpan."
      );
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    const updatedFormData = fields.reduce((accumulator, field) => {
      const value = record[field.name];

      if (Array.isArray(value)) {
        accumulator[field.name] = value.join(", ");
      } else if (value === null || value === undefined) {
        accumulator[field.name] = "";
      } else {
        accumulator[field.name] = String(value);
      }

      return accumulator;
    }, {});

    setFormData(updatedFormData);
    setEditingId(record.id);
    setSuccessMessage("");
    setError("");
  };

  const handleDelete = async (recordId) => {
    const isConfirmed = window.confirm("Yakin ingin menghapus data ini?");

    if (!isConfirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await fetchJson(`${endpoint}/${recordId}`, {
        method: "DELETE",
      });

      if (editingId === recordId) {
        setEditingId(null);
        setFormData(buildInitialState(fields));
      }

      setSuccessMessage("Data berhasil dihapus.");
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(buildInitialState(fields));
    setError("");
    setSuccessMessage("");
  };

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
            {editingId ? (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelEdit}
              >
                Batal Edit
              </button>
            ) : null}
          </div>
          {error ? <div className="alert error">{error}</div> : null}
          {successMessage ? <div className="alert success">{successMessage}</div> : null}

          <form className="data-form" onSubmit={handleSubmit}>
            {fields.map((field) => {
              if (field.type === "select-ibu") {
                return (
                  <label key={field.name} className="form-group">
                    <span>{field.label}</span>
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                    >
                      <option value="">Pilih ibu</option>
                      {ibuOptions.map((ibu) => (
                        <option key={ibu.id} value={ibu.id}>
                          {ibu.nama} - RM {ibu.no_rekam_medis || "-"}
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
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                      rows="4"
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
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                    >
                      <option value="">Pilih</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    required={field.required}
                  />
                </label>
              );
            })}

            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting
                ? editingId
                  ? "Menyimpan Perubahan..."
                  : "Menyimpan..."
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
          {loading ? (
            <p className="empty-state">Memuat data...</p>
          ) : displayedRecords.length === 0 ? (
            <p className="empty-state">Belum ada data tersimpan.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((record) => (
                    <tr key={record.id}>
                      {columns.map((column) => {
                        const value = record[column.key];
                        const displayValue = Array.isArray(value)
                          ? value.join(", ")
                          : value || "-";

                        return <td key={`${record.id}-${column.key}`}>{displayValue}</td>;
                      })}
                      <td>
                        <div className="action-buttons">
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
