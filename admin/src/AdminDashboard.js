// AdminDashboardApp/src/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Define some consistent colors for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#DE3163', '#6495ED', '#DC322B', '#E8B63A', '#41B3A3', '#6A057F', '#FB6964', '#3E444D'];

// Mapping des IDs de questions aux textes et types pour un affichage dynamique
// Cette liste définit l'ordre et le contenu de chaque "diapositive" du diaporama.
const dashboardSlidesMeta = [
  // Slide 0: Summary Statistics
  { id: 'summary-stats', question: 'Aperçu des Résultats du Sondage', type: 'summary' },

  // Ordered as requested:
  { id: "21398881", question: "Nom du cabinet de votre expert comptable", type: "text" },
  { id: "21398882", question: "N°Siret", type: "text" },
  { id: "21398883", question: "1/ Dans quel pays résidez-vous ?", type: "radio_other" },
  { id: "21398884", question: "2/ Dans quelle région résidez-vous ?", type: "radio_other" },
  { id: "21398885", question: "3/ Dans quelle ville résidez-vous ?", type: "text" },
  { id: "21398886", question: "4/ A quelle tranche d'âge appartenez-vous ?", type: "radio" },
  { id: "21398887", question: "5/ A quelle catégorie socio-professionnelle appartenez-vous ?", type: "radio_other" },
  { id: "21398888", question: "6/ Êtes-vous ?", type: "radio" },
  { id: "21398889", question: "7/ Connaissez-vous la notion de développement durable ?", type: "radio" },
  { id: "21398890", question: "8/ Classer les 3 piliers du développement durable...", type: "ranking" },
  { id: "21398891", question: "9/ Êtes-vous sensible aux actions environnementales et/ou sociales...?", type: "radio" },
  { id: "21398892", question: "10.1/ Lutter contre le réchauffement climatique :", type: "rating" },
  { id: "21398893", question: "10.2/ Réduire les inégalités :", type: "rating" },
  { id: "21398894", question: "10.3/ Garantir l'accès à la santé et à une alimentation de qualité pour tous :", type: "rating" },
  { id: "21398895", question: "10.4/ Accélérer la transition énergétique :", type: "rating" },
  { id: "21398896", question: "10.5/ Réduire le gaspillage et la production de déchets :", type: "rating" },
  { id: "21398897", question: "10.6/ Protéger la biodiversité aquatique et terrestre :", type: "rating" },
  { id: "21398898", question: "10.7/ Lutter contre les discriminations :", type: "rating" },
  { id: "21398899", question: "10.8/ Favoriser l'économie et les emplois locaux :", type: "rating" },
  { id: "2139900", question: "10.9/ Mettre en place des systèmes de gouvernance plus justes et plus inclusifs :", type: "rating" },
  { id: "21398901", question: "11/ Dans votre région, qui a le plus de pouvoirs pour agir...", type: "checkbox" },
  { id: "21398902", question: "12/ Actuellement, les mesures prises par ces organisations sont-elles en cohérence...", type: "radio" },
  { id: "21398903", question: "13.1/ Qualité et prix du produit :", type: "rating" },
  { id: "21398904", question: "13.2/ Bénéfice économique pour le territoire :", type: "rating" },
  { id: "21398905", question: "13.3/ Respect des droits humains et des salariés :", type: "rating" },
  { id: "21398906", question: "13.4/ Impact écologique du produit :", type: "rating" },
  { id: "21398907", question: "13.5/ Société commerciale, coopérative, entreprise à mission...", type: "rating" },
  { id: "21398908", question: "13.6/ Actions philanthropiques réalisées...", type: "rating" },
  { id: "21398909", question: "13.7/ Valeurs, éthique et transparence de l'organisation :", type: "rating" },
  { id: "21398910", question: "13.8/ Création de lien social autour de l'identité :", type: "rating" },
  { id: "21398911", question: "14/ Quelles problématiques devraient selon vous être traitées en priorité...", type: "checkbox" },
  { id: "21398912", question: "15/ Connaissez-vous au moins un label de développement durable ?", type: "radio" },
  { id: "21398913", question: "16/ Si oui, sur une échelle de 1 à 4, quel degré de confiance...", type: "rating" },
  { id: "21398914", question: "17/ Si on vous proposait un label territorial qui certifie...", type: "checkbox" },
  { id: "21398915", question: "18/ Est-ce qu'un complément de prix raisonnable et justifié...", type: "radio" },
  { id: "21398916", question: "19/ C'est presque terminé ! Souhaitez-vous recevoir les résultats...", type: "radio" },
];

// --- CSS Styles for the Dashboard (embedded for simplicity) ---
const dashboardStyles = `
  .admin-dashboard-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 900px; /* Wider for more charts */
    box-sizing: border-box;
    margin: 40px auto;
    position: relative; /* Needed for absolute positioning of navigation */
    min-height: 600px; /* Ensure enough height for slide content */
    display: flex;
    flex-direction: column;
  }

  .admin-dashboard-container h2 {
    text-align: center;
    color: #0056b3;
    margin-bottom: 30px;
    font-size: 2em;
    font-weight: 600;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .stat-card h3 {
    color: #333;
    margin-top: 0;
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  .stat-card p {
    font-size: 2.5em;
    font-weight: bold;
    color: #007bff;
  }

  /* Style for the current visible slide content */
  .slide-content-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    padding-top: 40px;
    box-sizing: border-box;
    width: 100%;
    overflow-y: auto;
    /* Always off-screen and hidden by default */
    position: absolute;
    top: 0;
    left: -9999px;
    visibility: hidden;
    height: 100%; /* Important for ResponsiveContainer */
  }

  /* Override for active slide to bring it into view */
  .slide-content-wrapper.active-slide {
    position: relative; /* Bring back to relative positioning for normal flow */
    left: 0;
    visibility: visible;
    height: auto; /* Let content define height */
  }


  .slide-content-wrapper .chart-section {
    width: 100%;
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
  }

  .chart-section h3 {
    color: #333;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5em;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
    text-align: center;
  }

  .loading-message, .error-message {
    text-align: center;
    font-size: 1.1em;
    margin: 20px 0;
  }

  .error-message {
    color: red;
  }

  .download-button, .nav-button {
    background-color: #28a745; /* Green for download, blue for nav */
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .download-button:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }

  .nav-button {
    background-color: #007bff; /* Blue for navigation */
    margin: 0 10px;
  }
  .nav-button:hover:not(:disabled) {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
  .nav-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .navigation-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    padding: 0 20px;
    flex-shrink: 0; /* Prevent navigation controls from shrinking */
  }

  .slide-counter {
    font-size: 1.1em;
    color: #555;
    font-weight: 500;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .admin-dashboard-container {
      padding: 20px 25px;
      margin: 20px;
    }
    .admin-dashboard-container h2 {
      font-size: 1.8em;
    }
    .stats-grid {
      grid-template-columns: 1fr; /* Stack cards on small screens */
    }
    .chart-section {
      padding: 15px;
    }
    .chart-section h3 {
      font-size: 1.3em;
    }
    .download-button, .nav-button {
      padding: 10px 15px;
      font-size: 0.9em;
    }
    .navigation-controls {
      flex-direction: column;
      gap: 15px;
    }
  }

  @media (max-width: 480px) {
    .admin-dashboard-container {
      padding: 15px 20px;
    }
    .admin-dashboard-container h2 {
      font-size: 1.5em;
    }
    .stat-card p {
      font-size: 2em;
    }
  }
`;


const AdminDashboard = () => {
  const [data, setData] = useState({}); // Stores all fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // State for current slide
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // New state for PDF generation status

  // Create an array of refs, one for each slide element
  const slideRefs = useRef([]);
  // Initialize or resize the refs array when dashboardSlidesMeta changes
  useEffect(() => {
      slideRefs.current = slideRefs.current.slice(0, dashboardSlidesMeta.length);
  }, []); // Removed dashboardSlidesMeta.length from dependency array

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);
        const fetchedData = {};

        // Fetch Total Submissions
        const totalRes = await fetch('http://localhost:5000/analytics/total-submissions');
        if (!totalRes.ok) throw new Error('Failed to fetch total submissions');
        fetchedData.totalSubmissions = (await totalRes.json()).total;

        // Fetch data for each question based on its type
        for (const qMeta of dashboardSlidesMeta) {
          // Skip fetching for the 'summary' slide as its data is already fetched (totalSubmissions)
          if (qMeta.type === 'summary') continue;

          let endpoint = '';
          if (qMeta.type === 'text') {
            endpoint = `/analytics/raw-text-answers/${qMeta.id}`;
          } else if (qMeta.type === 'radio') {
            endpoint = `/analytics/single-choice/${qMeta.id}`;
          } else if (qMeta.type === 'radio_other') {
            endpoint = `/analytics/single-choice-with-other/${qMeta.id}`;
          } else if (qMeta.type === 'checkbox') {
            endpoint = `/analytics/multi-select/${qMeta.id}`;
          } else if (qMeta.type === 'rating') {
            endpoint = `/analytics/average-rating/${qMeta.id}`;
          } else if (qMeta.type === 'ranking') {
            endpoint = `/analytics/ranking/${qMeta.id}`;
          }

          if (endpoint) {
            const res = await fetch(`http://localhost:5000${endpoint}`);
            if (!res.ok) {
                console.warn(`Failed to fetch data for ${qMeta.question} (ID: ${qMeta.id}) from ${endpoint}`);
                fetchedData[qMeta.id] = null;
                continue;
            }
            fetchedData[qMeta.id] = await res.json();
          }
        }
        setData(fetchedData);

      } catch (err) {
        console.error("Error fetching all dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Navigation handlers for the slideshow
  const goToNext = () => setCurrentSlideIndex(prev => Math.min(prev + 1, dashboardSlidesMeta.length - 1));
  const goToPrevious = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));

  // Function to handle PDF download - now captures each chart section as a new page
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true); // Show loading message
    // Initialize jsPDF with landscape orientation ('l')
    const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'p' for portrait
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Width of the PDF page (now landscape)
    const pdfHeight = pdf.internal.pageSize.getHeight(); // Height of the PDF page (now landscape)
    const margin = 10; // 10mm margin on each side

    for (let i = 0; i < dashboardSlidesMeta.length; i++) {
        const section = slideRefs.current[i];
        
        if (!section) {
            console.warn(`Ref element for slide ${dashboardSlidesMeta[i].id} not found for PDF capture. Skipping.`);
            continue;
        }

        // Store original styles
        const originalVisibility = section.style.visibility;
        const originalPosition = section.style.position;
        const originalLeft = section.style.left;
        const originalHeight = section.style.height;

        // Temporarily make the section visible and laid out for html2canvas
        section.style.visibility = 'visible';
        section.style.position = 'relative'; // Bring into normal flow for capture
        section.style.left = '0';
        section.style.height = 'auto'; // Let content define height for capture

        // Add a small delay to allow the browser to render the element after changing its visibility
        await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay for charts to render

        try {
            const canvas = await html2canvas(section, { scale: 2, logging: false, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality for smaller size

            let imgWidth = pdfWidth - (2 * margin); // Image width with margins
            let imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            // If the image is taller than the page height (minus margins), scale it down
            const maxPageHeightContent = pdfHeight - (2 * margin);
            if (imgHeight > maxPageHeightContent) {
                imgHeight = maxPageHeightContent;
                imgWidth = (canvas.width * imgHeight) / canvas.height; // Re-calculate width to maintain aspect ratio
            }

            // Center the image on the page
            const xOffset = (pdfWidth - imgWidth) / 2;
            const yOffset = (pdfHeight - imgHeight) / 2;

            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
        } catch (captureError) {
            console.error(`Error capturing slide ${dashboardSlidesMeta[i].id}:`, captureError);
            // Add an error message to the PDF if capture fails
            if (i > 0) {
                pdf.addPage();
            }
            pdf.text(`Erreur lors de la capture de la diapositive: ${dashboardSlidesMeta[i].question}`, margin, margin);
            pdf.text(`Détails: ${captureError.message}`, margin, margin + 10);
        } finally {
            // Revert to original styles
            section.style.visibility = originalVisibility;
            section.style.position = originalPosition;
            section.style.left = originalLeft;
            section.style.height = originalHeight;
        }
    }

    pdf.save('tableau_de-bord_sondage_presentation.pdf');
    setIsGeneratingPdf(false); // Hide loading message
  };


  if (loading) return <div className="admin-dashboard-container loading-message">Chargement du tableau de bord...</div>;
  if (error) return <div className="admin-dashboard-container error-message">Erreur lors du chargement du tableau de bord : {error}</div>;

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="admin-dashboard-container">
        <h2>Tableau de Bord Administrateur</h2>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button onClick={handleDownloadPdf} className="download-button" disabled={isGeneratingPdf}>
            {isGeneratingPdf ? 'Génération du PDF...' : 'Télécharger la Présentation en PDF'}
          </button>
        </div>

        {isGeneratingPdf && (
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque
                display: 'flex',
                flexDirection: 'column', // Align text and spinner vertically
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                fontSize: '1.5em',
                color: '#0056b3',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                En cours de téléchargement... Veuillez patienter.
                {/* Optional: Add a simple spinner */}
                <div style={{
                    border: '8px solid #f3f3f3',
                    borderTop: '8px solid #0056b3',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    animation: 'spin 1s linear infinite',
                    marginTop: '20px'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )}

        {/* The dynamic slide content area - Renders ALL slides, but conditionally displays them */}
        {/* The slides are rendered in the DOM, but only one is visible at a time */}
        <div style={{ position: 'relative', width: '100%', flexGrow: 1, overflow: 'hidden' }}>
          {dashboardSlidesMeta.map((qMeta, index) => {
            const qDataForSlide = data[qMeta.id]; // Data for the current question/slide
            // Determine if this slide should be visible based on currentSlideIndex
            const isVisible = index === currentSlideIndex;

            // Conditionally render content based on slide type and data availability
            const slideContent = (
              <>
                {qMeta.type === 'summary' && (
                  <>
                    <h2 style={{ textAlign: 'center', color: '#0056b3', marginBottom: '30px', fontSize: '2em' }}>
                      {qMeta.question}
                    </h2>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <h3>Total des Soumissions</h3>
                        <p>{data.totalSubmissions || 0}</p>
                      </div>
                      {/* Removed the "Note Moyenne (Q10.1)" card as requested */}
                      {/* {data["21398892"] && data["21398892"].averageRating !== undefined && (
                        <div className="stat-card">
                          <h3>Note Moyenne (Q10.1)</h3>
                          <p>{data["21398892"].averageRating.toFixed(2)}</p>
                        </div>
                      )} */}
                    </div>
                  </>
                )}

                {qMeta.type !== 'summary' && (
                  (!qDataForSlide || (Array.isArray(qDataForSlide) && qDataForSlide.length === 0) || (typeof qDataForSlide === 'object' && Object.keys(qDataForSlide).length === 0 && qMeta.type !== 'rating')) ? (
                    <p style={{textAlign: 'center', color: '#666'}}>Aucune donnée disponible pour cette question.</p>
                  ) : (
                    <div className="chart-section">
                      <h3>{qMeta.question}</h3>
                      {qMeta.type === 'text' && (
                        <ResponsiveContainer width="100%" height={Math.max(300, qDataForSlide.length * 40)}>
                          <BarChart
                            data={qDataForSlide}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis type="category" dataKey="_id" width={250} interval={0} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Nombre de réponses" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {(qMeta.type === 'radio' || qMeta.type === 'radio_other') && (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={qDataForSlide}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              dataKey="count"
                              nameKey="_id"
                              label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {qDataForSlide.map((entry, idx) => (
                                <Cell key={`cell-${qMeta.id}-${idx}`} fill={COLORS[idx % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                      {qMeta.type === 'checkbox' && (
                        <ResponsiveContainer width="100%" height={Math.max(300, qDataForSlide.length * 40)}>
                          <BarChart
                            data={qDataForSlide}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis type="category" dataKey="_id" width={250} interval={0} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Nombre de sélections" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {qMeta.type === 'rating' && qDataForSlide.averageRating !== undefined && (
                        <div>
                          <p style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
                            Note Moyenne : {qDataForSlide.averageRating.toFixed(2)} / 4
                          </p>
                          {qDataForSlide.distribution && Object.keys(qDataForSlide.distribution).length > 0 && (
                              <ResponsiveContainer width="100%" height={200}>
                                  <BarChart
                                      data={Object.keys(qDataForSlide.distribution).map(key => ({
                                          name: `${key} étoile(s)`,
                                          count: qDataForSlide.distribution[key]
                                      }))}
                                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                  >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis allowDecimals={false} />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="count" fill="#FFC107" name="Nombre de réponses" />
                                  </BarChart>
                              </ResponsiveContainer>
                          )}
                        </div>
                      )}
                      {qMeta.type === 'ranking' && (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart
                            data={Object.keys(qDataForSlide).map(optionName => {
                              const ranksCount = qDataForSlide[optionName];
                              return {
                                name: optionName,
                                'Rang 1': ranksCount['1'] || 0,
                                'Rang 2': ranksCount['2'] || 0,
                                'Rang 3': ranksCount['3'] || 0,
                              };
                            })}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Rang 1" fill="#4CAF50" name="Rang 1 (Plus important)" />
                            <Bar dataKey="Rang 2" fill="#FFC107" name="Rang 2 (Moyennement important)" />
                            <Bar dataKey="Rang 3" fill="#F44336" name="Rang 3 (Moins important)" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  )
                )}
              </>
            );

            return (
              <div
                key={qMeta.id}
                ref={el => slideRefs.current[index] = el}
                className={`slide-content-wrapper ${isVisible ? 'active-slide' : ''}`}
                // The style property below ensures non-active slides are always off-screen
                // This is crucial for html2canvas to capture them without them appearing to the user.
                style={!isVisible ? { position: 'absolute', left: '-9999px', visibility: 'hidden', height: '100%' } : {}}
              >
                {slideContent}
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="navigation-controls">
          <button
            onClick={goToPrevious}
            disabled={currentSlideIndex === 0}
            className="nav-button"
          >
            Précédent
          </button>
          <span className="slide-counter">
            {currentSlideIndex + 1} / {dashboardSlidesMeta.length}
          </span>
          <button
            onClick={goToNext}
            disabled={currentSlideIndex === dashboardSlidesMeta.length - 1}
            className="nav-button"
          >
            Suivant
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
