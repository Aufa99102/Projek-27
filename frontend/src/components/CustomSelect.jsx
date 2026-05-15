import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import "../styles/CustomSelect.css";

const normalizeOptions = (options = []) =>
  options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : { value: option.value, label: option.label }
  );

function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih",
  searchPlaceholder = "Cari...",
  searchable = false,
  disabled = false,
  className = "",
  panelClassName = "",
}) {
  const selectId = useId();
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return normalizedOptions;
    }

    const keyword = searchTerm.trim().toLowerCase();
    return normalizedOptions.filter((option) =>
      String(option.label).toLowerCase().includes(keyword)
    );
  }, [normalizedOptions, searchable, searchTerm]);
  const selectedIndex = normalizedOptions.findIndex(
    (option) => String(option.value) === String(value)
  );
  const selectedOption = selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const nextIndex = filteredOptions.findIndex(
        (option) => String(option.value) === String(value)
      );
      setActiveIndex(nextIndex >= 0 ? nextIndex : 0);
      if (searchable) {
        window.setTimeout(() => searchInputRef.current?.focus(), 30);
      }
    }
  }, [filteredOptions, isOpen, searchable, value]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    const activeNode = listRef.current?.querySelector(
      `[data-option-index="${activeIndex}"]`
    );

    activeNode?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (disabled) {
      return;
    }

    if (!isOpen && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setIsOpen(true);
      return;
    }

    if (!isOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex].value);
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`custom-select ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${className}`.trim()}
    >
      <button
        type="button"
        id={selectId}
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${selectId}-listbox`}
        disabled={disabled}
        onClick={() => {
          setSearchTerm("");
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={`custom-select-value ${selectedOption ? "selected" : ""}`}>
          {selectedOption?.label || placeholder}
        </span>
        <span className="custom-select-icon" aria-hidden="true" />
      </button>

      <div
        ref={listRef}
        id={`${selectId}-listbox`}
        className={`custom-select-panel ${panelClassName}`.trim()}
        role="listbox"
        aria-labelledby={selectId}
      >
        {searchable ? (
          <div className="custom-select-search-shell">
            <input
              ref={searchInputRef}
              type="search"
              className="custom-select-search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setActiveIndex(0);
              }}
              placeholder={searchPlaceholder}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : null}

        {filteredOptions.map((option, index) => {
          const isSelected = String(option.value) === String(value);
          const isActive = index === activeIndex;

          return (
            <button
              key={`${option.value}-${index}`}
              type="button"
              role="option"
              data-option-index={index}
              aria-selected={isSelected}
              className={`custom-select-option ${isSelected ? "selected" : ""} ${isActive ? "active" : ""}`.trim()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleSelect(option.value)}
            >
              <span className="custom-select-option-label">{option.label}</span>
              {isSelected ? <span className="custom-select-option-check" aria-hidden="true" /> : null}
            </button>
          );
        })}

        {filteredOptions.length === 0 ? (
          <div className="custom-select-empty">Tidak ada hasil yang cocok.</div>
        ) : null}
      </div>
    </div>
  );
}

export default CustomSelect;
