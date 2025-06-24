// src/components/form.js
import React, { useState, useRef } from 'react';
import './form.css'; // pour overrides éventuels (taille, étoiles…)

/** Composant d’étoiles cliquables (1–4) */
function StarRating({ name, value, onChange }) {
  return (
    <div className="star-rating mb-2">
      {[1, 2, 3, 4].map((star) => (
        <svg
          key={star}
          onClick={() => onChange(name, star)}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill={value >= star ? '#FFC107' : 'none'}
          stroke="#FFC107"
          strokeWidth="2"
          style={{ cursor: 'pointer', marginRight: 4 }}
        >
          <polygon points="12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9" />
        </svg>
      ))}
    </div>
  );
}

export default function Form() {
  const formRef = useRef();

  // 9 sous-questions étoilées
  const importanceQuestions = [
    { id: 'climate', label: 'Lutter contre le réchauffement climatique' },
    { id: 'inequalities', label: 'Réduire les inégalités' },
    { id: 'health', label: "Garantir l'accès à la santé et à une alimentation de qualité pour tous" },
    { id: 'energy', label: 'Accélérer la transition énergétique' },
    { id: 'waste', label: 'Réduire le gaspillage et la production de déchets' },
    { id: 'biodiversity', label: 'Protéger la biodiversité aquatique et terrestre' },
    { id: 'discrimination', label: 'Lutter contre les discriminations' },
    { id: 'localEconomy', label: "Favoriser l'économie et les emplois locaux" },
    { id: 'governance', label: 'Mettre en place des systèmes de gouvernance plus justes et plus inclusifs' },
  ];

  const regions = [
    'Occitanie','PACA','Nouvelle Aquitaine','Auvergne Rhône-Alpes',
    'Ile-de-France','Bretagne','Grand Est','Hauts-de-France',
    'Normandie','Centre-Val de Loire','Pays de la Loire',
    'Bourgogne-Franche-Comté','Corse','DROM','Régions limitrophes'
  ];
  const socioCats = [
    'Agriculteur','Artisan/Commerçant','Cadre','Profession intermédiaire',
    'Employé','Ouvrier','Retraité','Étudiant','Autre'
  ];
  const actorsOptions = [
    'Citoyens','État','Entreprises','Associations',
    'Collectivités','Institutions UE','Organismes de recherche'
  ];

  // état initial
  const [formData, setFormData] = useState({
    cabinetName: '',
    siretNumber: '',
    country: '',
    region: '',
    city: '',
    ageRange: '',
    socio: [],
    gender: '',
    ddKnowledge: '',
    sensitivity: '',
    pillars: { social: '', environmental: '', economic: '' },
    climateImportance: '',
    actors: [],
    ...importanceQuestions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {})
  });
  const [errors, setErrors] = useState({});

  // gestion des champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && Array.isArray(formData[name])) {
      setFormData(prev => {
        const arr = prev[name];
        const next = checked ? [...arr, value] : arr.filter(v => v !== value);
        if (name === 'actors' && next.length > 3) return prev;
        return { ...prev, [name]: next };
      });
    } else if (name.startsWith('pillar_')) {
      const key = name.replace('pillar_', '');
      setFormData(prev => ({
        ...prev,
        pillars: { ...prev.pillars, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // gestion des étoiles
  const handleStarChange = (name, rating) => {
    setFormData(prev => ({ ...prev, [name]: rating }));
  };

  // validation
  const validate = () => {
    const errs = {};
    if (!formData.cabinetName.trim()) errs.cabinetName = 'Requis';
    if (!formData.siretNumber.trim()) errs.siretNumber = 'Requis';
    if (!formData.country) errs.country = 'Requis';
    if (!formData.region) errs.region = 'Requis';
    if (!formData.city.trim()) errs.city = 'Requis';
    if (!formData.ageRange) errs.ageRange = 'Requis';
    if (!formData.socio.length) errs.socio = 'Sélection requise';
    if (!formData.gender) errs.gender = 'Requis';
    if (!formData.ddKnowledge) errs.ddKnowledge = 'Requis';
    if (!formData.sensitivity) errs.sensitivity = 'Requis';
    ['social','environmental','economic'].forEach(k => {
      if (!formData.pillars[k]) errs.pillars = 'Classement requis';
    });
    if (formData.climateImportance === '') errs.climateImportance = 'Requis';
    if (!formData.actors.length) errs.actors = 'Sélection requise';
    importanceQuestions.forEach(q => {
      if (formData[q.id] === 0) errs[q.id] = 'Requis';
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    console.log('Données soumises :', formData);
    alert('Formulaire soumis !');
  };

  return (
    <div ref={formRef} className="container my-5">
      <h2 className="mb-5 text-center">Sondage Développement Durable</h2>
      <form onSubmit={handleSubmit} noValidate>

        {/* 1. Cabinet */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              1 / Nom du cabinet de votre expert comptable <span className="text-danger">*</span>
            </label>
            <input
              name="cabinetName"
              className={`form-control form-control-sm ${errors.cabinetName ? 'is-invalid' : ''}`}
              placeholder="Ace4rse"
              value={formData.cabinetName}
              onChange={handleChange}
            />
            {errors.cabinetName && <div className="invalid-feedback">{errors.cabinetName}</div>}
          </div>
        </div>

        {/* 2. Siret */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              2 / N° Siret <span className="text-danger">*</span>
            </label>
            <input
              name="siretNumber"
              className={`form-control form-control-sm ${errors.siretNumber ? 'is-invalid' : ''}`}
              placeholder="425 076 395 00044"
              value={formData.siretNumber}
              onChange={handleChange}
            />
            {errors.siretNumber && <div className="invalid-feedback">{errors.siretNumber}</div>}
          </div>
        </div>

        {/* 3. Pays */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              3 / Dans quel pays résidez-vous ? <span className="text-danger">*</span>
            </label>
            {['France','Autre'].map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="country"
                  type="radio"
                  className="form-check-input"
                  value={opt}
                  checked={formData.country === opt}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.country && <div className="text-danger mt-1">{errors.country}</div>}
          </div>
        </div>

        {/* 4. Région */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              4 / Dans quelle région résidez-vous ? <span className="text-danger">*</span>
            </label>
            <select
              name="region"
              className={`form-select form-select-sm ${errors.region ? 'is-invalid' : ''}`}
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">— Choisir —</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.region && <div className="invalid-feedback">{errors.region}</div>}
          </div>
        </div>

        {/* 5. Ville */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              5 / Dans quelle ville résidez-vous ? <span className="text-danger">*</span>
            </label>
            <input
              name="city"
              className={`form-control form-control-sm ${errors.city ? 'is-invalid' : ''}`}
              placeholder="Votre ville"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>
        </div>

        {/* 6. Âge */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              6 / Tranche d’âge ? <span className="text-danger">*</span>
            </label>
            {['18-24','25-34','35-49','50+'].map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="ageRange"
                  type="radio"
                  className="form-check-input"
                  value={opt}
                  checked={formData.ageRange === opt}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.ageRange && <div className="text-danger mt-1">{errors.ageRange}</div>}
          </div>
        </div>

        {/* 7. Socio-professionnelle */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              7 / Catégorie socio-professionnelle <span className="text-danger">*</span>
            </label>
            {socioCats.map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="socio"
                  type="checkbox"
                  className="form-check-input"
                  value={opt}
                  checked={formData.socio.includes(opt)}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.socio && <div className="text-danger mt-1">{errors.socio}</div>}
          </div>
        </div>

        {/* 8. Genre */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              8 / Genre <span className="text-danger">*</span>
            </label>
            {['Femme','Homme','Autre'].map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="gender"
                  type="radio"
                  className="form-check-input"
                  value={opt}
                  checked={formData.gender === opt}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
          </div>
        </div>

        {/* 9. Connaissance DD */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              9 / Connaissez-vous la notion de développement durable ? <span className="text-danger">*</span>
            </label>
            {['Oui','Non'].map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="ddKnowledge"
                  type="radio"
                  className="form-check-input"
                  value={opt}
                  checked={formData.ddKnowledge === opt}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.ddKnowledge && <div className="text-danger mt-1">{errors.ddKnowledge}</div>}
          </div>
        </div>

        {/* 10. Sensibilité */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              10 / Êtes-vous sensible aux actions environnementales/sociales ? <span className="text-danger">*</span>
            </label>
            {['Sensible','Plutôt sensible','Peu sensible','Pas du tout'].map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="sensitivity"
                  type="radio"
                  className="form-check-input"
                  value={opt}
                  checked={formData.sensitivity === opt}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.sensitivity && <div className="text-danger mt-1">{errors.sensitivity}</div>}
          </div>
        </div>

        {/* 11–19. Enjeux étoilés */}
        {importanceQuestions.map((q, idx) => (
          <div key={q.id} className="card mb-4 border-0 shadow-sm bg-light">
            <div className="card-body rounded-4">
              <label className="form-label fw-semibold">
                {`${11 + idx} / ${q.label}`} <span className="text-danger">*</span>
              </label>
              <StarRating
                name={q.id}
                value={formData[q.id]}
                onChange={handleStarChange}
              />
              {errors[q.id] && <div className="text-danger small mt-1">{errors[q.id]}</div>}
            </div>
          </div>
        ))}

        {/* 20. Acteurs */}
        <div className="card mb-4 border-0 shadow-sm bg-light">
          <div className="card-body rounded-4">
            <label className="form-label fw-semibold">
              20 / Qui a le plus de pouvoir (max 3) ? <span className="text-danger">*</span>
            </label>
            {actorsOptions.map(opt => (
              <div className="form-check" key={opt}>
                <input
                  name="actors"
                  type="checkbox"
                  className="form-check-input"
                  value={opt}
                  checked={formData.actors.includes(opt)}
                  onChange={handleChange}
                  disabled={formData.actors.length >= 3 && !formData.actors.includes(opt)}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
            {errors.actors && <div className="text-danger mt-1">{errors.actors}</div>}
          </div>
        </div>

        {/* Bouton */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg px-5">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
}
