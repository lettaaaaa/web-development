import React from 'react';
import headingImage from '../../images/5.jpg';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-image">
      <marquee>"куріння шкодить вашому здоров'ю, бігайте - теж кашляти будете"</marquee>
        <img src={headingImage} alt="Placeholder" />
      </div>
      <div className="hero-text">
        <h1>Шкари</h1>
        <p>Сайт з кращими кросівочками від спортсменки МСУ Віолки)</p>
      </div>
    </section>
  );
};

export default HeroSection;