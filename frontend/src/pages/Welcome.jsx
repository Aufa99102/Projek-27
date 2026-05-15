import React from "react";
import { Link } from "react-router-dom";
import pregnantPhotoshoot from "../assets/pregnant-photoshoot.jpg";
import "../styles/Welcome.css";

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const getGreeting = (hours) => {
  if (hours < 11) {
    return "Selamat pagi";
  }

  if (hours < 15) {
    return "Selamat siang";
  }

  if (hours < 18) {
    return "Selamat sore";
  }

  return "Selamat malam";
};

function Welcome() {
  const currentDate = new Date();
  const greeting = getGreeting(currentDate.getHours());
  const currentDayLabel = FULL_DATE_FORMATTER.format(currentDate);

  return (
    <section className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-media">
          <div className="welcome-media-gradient" aria-hidden="true" />
          <div className="welcome-heartbeat-ring welcome-heartbeat-ring-one" aria-hidden="true" />
          <div className="welcome-heartbeat-ring welcome-heartbeat-ring-two" aria-hidden="true" />
          <img
            src={pregnantPhotoshoot}
            alt="Foto ibu hamil"
            className="welcome-image"
          />
        </div>

        <div className="welcome-copy">
          <p className="page-overline welcome-reveal welcome-reveal-overline">KI-DIGITAL</p>
          <h1 className="welcome-reveal welcome-reveal-title">{greeting}</h1>
          <p className="welcome-date welcome-reveal welcome-reveal-date">{currentDayLabel}</p>
          <p className="welcome-description welcome-reveal welcome-reveal-description">
            Selamat datang di sistem pencatatan kesehatan ibu hamil. Tekan
            tombol mulai untuk masuk ke dashboard utama.
          </p>
          <div className="welcome-actions welcome-reveal welcome-reveal-actions">
            <Link to="/dashboard" className="primary-button welcome-button">
              Mulai
            </Link>
          </div>
          <div className="welcome-floating-card" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
