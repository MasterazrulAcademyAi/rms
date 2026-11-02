// app.js

// Sample weekly syllabus data
const SAMPLE_WEEKLY_SYLLABUS = `2.2 Explain shells and Command Line Interface (CLI) for Linux and Windows environment.
2.2.1 Explain shells and command line interface
2.2.2 Explain types of shell
2.2.3 Explain the shell environmental files
2.2.4 Explain the shell metacharacters
2.2.5 Display shell and command line variables and aliases
3.0 Linux Server Administration
3.1 Construct Filesystem Hierarchy Standard (FHS) in linux directory structure.
3.1.1 Explain the Filesystem Hierarchy Standard (FHS)
3.1.2 Explain the Linux directories defined by the FHS
3.1.3 Show the relative and absolute pathnames`;

// App State
let state = {
  lecturerName: "MOHD AZRULNIZAM BIN MOHD KAMARUDIN",
  subjectName: "DFP40203 - Web Application Development",
  currentWeek: 1,
  language: "BM", // "BM" or "EN"
  weeklySyllabus: {
    1: SAMPLE_WEEKLY_SYLLABUS,
    2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""
  },
  records: {} // Format: { "w1_s1": { date, type, present, total, understanding, issue } }
};

// Translation Dictionary for UI elements
const translations = {
  BM: {
    "header-sys": "Sistem (RMS)",
    "header-sub": "Penjana Ayat Aktiviti, Refleksi & CQI - Disatukan untuk Salin & Tampal Mudah",
    "lecturer-badge": "Pensyarah",
    "title-profile": "Profil & Subjek",
    "label-name": "Nama Pensyarah",
    "label-subject": "Nama Subjek / Kod",
    "title-syllabus": "Silibus",
    "btn-sample": "Isi Contoh",
    "desc-syllabus": "Tampal semua sub-topik pengajaran bagi minggu ini (satu baris bagi setiap sub-topik):",
    "title-agihan": "Agihan Sub-topik Sesi",
    "desc-agihan-placeholder": "Tampal silibus di atas untuk melihat agihan sesi.",
    "s1-title": "Sesi 1 (Kelas 2 Jam)",
    "s1-subtitle": "Teori / Asas",
    "s2-title": "Sesi 2 (Kelas 2 Jam)",
    "s2-subtitle": "Praktikal / Amali",
    "s3-title": "Sesi 3 (Kelas 1 Jam)",
    "s3-subtitle": "Tutorial / Imbasan",
    "label-date": "Tarikh",
    "label-class-type": "Jenis Kelas",
    "label-attendance": "Hadir / Jumlah",
    "label-understanding-prefix": "Kefahaman",
    "label-issue": "Isu / Masalah",
    "opt-kuliah": "Kuliah (Teori)",
    "opt-amali": "Amali / Lab",
    "opt-tutorial": "Tutorial",
    "opt-kuiz": "Kuiz / Ujian",
    "opt-tangguh": "Cuti / Tangguh",
    "opt-issue-tiada": "Tiada Isu / Lancar",
    "opt-issue-fokus": "Pelajar kurang fokus",
    "opt-issue-faham": "Pelajar lambat faham",
    "opt-issue-teknikal": "Masalah PC/Internet",
    "opt-issue-masa": "Kekangan masa",
    "opt-issue-kehadiran": "Kehadiran kurang memuaskan",
    "editor-title-notes": "NOTES (Aktiviti & Kandungan Seluruh Minggu)",
    "editor-title-reflection": "REFLECTION (Refleksi Seluruh Minggu)",
    "editor-title-cqi": "ANALYSIS & CQI (Penambahbaikan Seluruh Minggu)",
    "btn-copy-notes": "Salin NOTES",
    "btn-copy-reflection": "Salin REFLECTION",
    "btn-copy-cqi": "Salin CQI",
    "footer-desc": "Sila semak semula ayat di atas sebelum menyalin ke portal.",
    "btn-export": "Eksport JSON",
    "btn-import": "Import JSON",
    "btn-reset": "Reset Data"
  },
  EN: {
    "header-sys": "System (RMS)",
    "header-sub": "Activities, Reflection & CQI Sentence Generator - Unified for Easy Copy & Paste",
    "lecturer-badge": "Lecturer",
    "title-profile": "Profile & Subject",
    "label-name": "Lecturer Name",
    "label-subject": "Subject Name / Code",
    "title-syllabus": "Syllabus",
    "btn-sample": "Fill Sample",
    "desc-syllabus": "Paste all teaching sub-topics for this week (one line per sub-topic):",
    "title-agihan": "Session Topic Distribution",
    "desc-agihan-placeholder": "Paste syllabus above to see session distribution.",
    "s1-title": "Session 1 (2-Hour Class)",
    "s1-subtitle": "Theory / Basics",
    "s2-title": "Session 2 (2-Hour Class)",
    "s2-subtitle": "Practical / Lab",
    "s3-title": "Session 3 (1-Hour Class)",
    "s3-subtitle": "Tutorial / Review",
    "label-date": "Date",
    "label-class-type": "Class Type",
    "label-attendance": "Present / Total",
    "label-understanding-prefix": "Understanding",
    "label-issue": "Issue / Problem",
    "opt-kuliah": "Lecture (Theory)",
    "opt-amali": "Practical / Lab",
    "opt-tutorial": "Tutorial",
    "opt-kuiz": "Quiz / Test",
    "opt-tangguh": "Postponed / Holiday",
    "opt-issue-tiada": "No Issues / Smooth",
    "opt-issue-fokus": "Students lack focus",
    "opt-issue-faham": "Students slow to understand",
    "opt-issue-teknikal": "PC/Internet problems",
    "opt-issue-masa": "Time constraints",
    "opt-issue-kehadiran": "Unsatisfactory attendance",
    "editor-title-notes": "NOTES (Weekly Activities & Content)",
    "editor-title-reflection": "REFLECTION (Weekly Reflection)",
    "editor-title-cqi": "ANALYSIS & CQI (Weekly Improvement)",
    "btn-copy-notes": "Copy NOTES",
    "btn-copy-reflection": "Copy REFLECTION",
    "btn-copy-cqi": "Copy CQI",
    "footer-desc": "Please review the sentences above before copying to the portal.",
    "btn-export": "Export JSON",
    "btn-import": "Import JSON",
    "btn-reset": "Reset Data"
  }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  setupEventListeners();
  updateWeekView();
});

// Load State from LocalStorage
function loadFromLocalStorage() {
  const savedState = localStorage.getItem("rms_state_weekly_v5");
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      state = { ...state, ...parsed };
      
      document.getElementById("lecturer-name").value = state.lecturerName;
      document.getElementById("subject-name").value = state.subjectName;
      document.getElementById("lecturer-name-display").textContent = state.lecturerName;
    } catch (e) {
      console.error("Error loading state from localStorage", e);
    }
  }
}

// Save State to LocalStorage
function saveToLocalStorage() {
  state.lecturerName = document.getElementById("lecturer-name").value;
  state.subjectName = document.getElementById("subject-name").value;
  state.weeklySyllabus[state.currentWeek] = document.getElementById("syllabus-raw").value;
  
  document.getElementById("lecturer-name-display").textContent = state.lecturerName;
  localStorage.setItem("rms_state_weekly_v5", JSON.stringify(state));
}

// Translate UI language dynamically
function updateUILanguage() {
  const lang = state.language || "BM";
  
  // Update toggle button active states
  if (lang === "BM") {
    document.getElementById("btn-lang-bm").classList.add("active");
    document.getElementById("btn-lang-en").classList.remove("active");
  } else {
    document.getElementById("btn-lang-bm").classList.remove("active");
    document.getElementById("btn-lang-en").classList.add("active");
  }
  
  // Translate texts
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      if (key === "title-syllabus") {
        // Special case: preserve sibling span text
        el.firstChild.textContent = translations[lang][key] + " ";
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Handle placeholders and guide text
  const guideBox = document.getElementById("quick-guide-box");
  if (lang === "BM") {
    document.getElementById("syllabus-raw").placeholder = "Contoh:\n2.2.1 Explain shells and CLI\n2.2.2 Explain types of shell\n2.2.3 Explain environmental files";
    document.getElementById("subject-name").placeholder = "Contoh: DFP40203";
    document.getElementById("lecturer-name").placeholder = "Nama Pensyarah";
    guideBox.innerHTML = `<strong>Panduan Pantas:</strong><br>
      1. Pilih Tarikh Sesi 1. Sesi 2 & 3 akan diset secara automatik (+2 & +3 hari).<br>
      2. Teks di kotak output di bawah dijana mengikut tarikh. Klik **Salin** untuk tampal terus ke TinyMCE.`;
    document.getElementById("current-topic-display").textContent = "Subjek Aktif: " + state.subjectName;
  } else {
    document.getElementById("syllabus-raw").placeholder = "Example:\n2.2.1 Explain shells and CLI\n2.2.2 Explain types of shell\n2.2.3 Explain environmental files";
    document.getElementById("subject-name").placeholder = "Example: DFP40203";
    document.getElementById("lecturer-name").placeholder = "Lecturer Name";
    guideBox.innerHTML = `<strong>Quick Guide:</strong><br>
      1. Select Session 1 Date. Session 2 & 3 will be set automatically (+2 & +3 days).<br>
      2. Output texts below are grouped by date. Click **Copy** to paste directly into TinyMCE.`;
    document.getElementById("current-topic-display").textContent = "Active Subject: " + state.subjectName;
  }
}

// Helper: Format YYYY-MM-DD to DD/MM/YYYY
function formatDateToLocal(dateStr) {
  if (!dateStr) return "[Tarikh]" || "[Date]";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
  }
  return dateStr;
}

// Helper: Add days to YYYY-MM-DD date string
function addDays(dateStr, days) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Setup DOM Event Listeners
function setupEventListeners() {
  // Language Switchers
  document.getElementById("btn-lang-bm").addEventListener("click", () => {
    state.language = "BM";
    updateUILanguage();
    triggerAutoCompiledGeneration();
    saveToLocalStorage();
  });

  document.getElementById("btn-lang-en").addEventListener("click", () => {
    state.language = "EN";
    updateUILanguage();
    triggerAutoCompiledGeneration();
    saveToLocalStorage();
  });

  // Sync Profile info
  document.getElementById("lecturer-name").addEventListener("input", saveToLocalStorage);
  document.getElementById("subject-name").addEventListener("input", (e) => {
    const label = state.language === "BM" ? "Subjek Aktif: " : "Active Subject: ";
    document.getElementById("current-topic-display").textContent = label + e.target.value;
    saveToLocalStorage();
  });
  
  // Syllabus box listeners
  const syllabusTextarea = document.getElementById("syllabus-raw");
  syllabusTextarea.addEventListener("input", () => {
    saveToLocalStorage();
    triggerAutoCompiledGeneration();
  });

  document.getElementById("btn-sample-syllabus").addEventListener("click", () => {
    syllabusTextarea.value = SAMPLE_WEEKLY_SYLLABUS;
    saveToLocalStorage();
    triggerAutoCompiledGeneration();
  });

  // Week Controls
  document.getElementById("btn-prev-week").addEventListener("click", () => {
    if (state.currentWeek > 1) {
      saveOutputsToState();
      state.currentWeek--;
      updateWeekView();
    }
  });

  document.getElementById("btn-next-week").addEventListener("click", () => {
    if (state.currentWeek < 14) {
      saveOutputsToState();
      state.currentWeek++;
      updateWeekView();
    }
  });

  // Date Auto-recommendation for Sesi 2 and 3 based on Sesi 1
  document.getElementById("s1-date").addEventListener("change", (e) => {
    const s1Date = e.target.value;
    if (s1Date) {
      const s2DateInput = document.getElementById("s2-date");
      const s3DateInput = document.getElementById("s3-date");
      
      s2DateInput.value = addDays(s1Date, 2);
      s3DateInput.value = addDays(s1Date, 3);
      
      triggerAutoCompiledGeneration();
    }
  });

  // Trigger regeneration on input changes for all sessions
  for (let s = 1; s <= 3; s++) {
    const rangeInput = document.getElementById(`s${s}-understanding`);
    const valDisplay = document.getElementById(`s${s}-understanding-val`);
    rangeInput.addEventListener("input", (e) => {
      valDisplay.textContent = e.target.value + "%";
      triggerAutoCompiledGeneration();
    });

    document.getElementById(`s${s}-date`).addEventListener("change", () => triggerAutoCompiledGeneration());
    document.getElementById(`s${s}-type`).addEventListener("change", () => triggerAutoCompiledGeneration());
    document.getElementById(`s${s}-attendance-present`).addEventListener("input", () => triggerAutoCompiledGeneration());
    document.getElementById(`s${s}-attendance-total`).addEventListener("input", () => triggerAutoCompiledGeneration());
    document.getElementById(`s${s}-issue`).addEventListener("change", () => triggerAutoCompiledGeneration());
  }

  // Textarea manual edits triggers auto-save
  document.getElementById("compiled-notes-output").addEventListener("input", () => saveOutputsToState());
  document.getElementById("compiled-reflection-output").addEventListener("input", () => saveOutputsToState());
  document.getElementById("compiled-cqi-output").addEventListener("input", () => saveOutputsToState());

  // Copy buttons
  document.getElementById("btn-copy-compiled-notes").addEventListener("click", () => {
    const msg = state.language === "BM" ? "NOTES mingguan berjaya disalin!" : "Weekly NOTES copied successfully!";
    copyToClipboard(document.getElementById("compiled-notes-output").value, msg);
  });
  document.getElementById("btn-copy-compiled-reflection").addEventListener("click", () => {
    const msg = state.language === "BM" ? "REFLECTION mingguan berjaya disalin!" : "Weekly REFLECTION copied successfully!";
    copyToClipboard(document.getElementById("compiled-reflection-output").value, msg);
  });
  document.getElementById("btn-copy-compiled-cqi").addEventListener("click", () => {
    const msg = state.language === "BM" ? "CQI mingguan berjaya disalin!" : "Weekly CQI copied successfully!";
    copyToClipboard(document.getElementById("compiled-cqi-output").value, msg);
  });

  // Export/Import/Reset Actions
  document.getElementById("btn-export").addEventListener("click", exportData);
  
  const fileImport = document.getElementById("file-import");
  document.getElementById("btn-import-trigger").addEventListener("click", () => {
    fileImport.click();
  });
  fileImport.addEventListener("change", importData);

  document.getElementById("btn-reset").addEventListener("click", () => {
    const confirmMsg = state.language === "BM" 
      ? "Adakah anda pasti mahu mereset semua data? Tindakan ini akan mengosongkan rekod tersimpan."
      : "Are you sure you want to reset all data? This will clear all saved records.";
    if (confirm(confirmMsg)) {
      localStorage.removeItem("rms_state_weekly_v5");
      state = {
        lecturerName: "MOHD AZRULNIZAM BIN MOHD KAMARUDIN",
        subjectName: "DFP40203 - Web Application Development",
        currentWeek: 1,
        language: "BM",
        weeklySyllabus: {
          1: SAMPLE_WEEKLY_SYLLABUS,
          2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""
        },
        records: {}
      };
      document.getElementById("lecturer-name").value = state.lecturerName;
      document.getElementById("subject-name").value = state.subjectName;
      updateWeekView();
      saveToLocalStorage();
      const resetMsg = state.language === "BM" ? "Data telah dilerai (reset)." : "Data has been reset.";
      showToast(resetMsg, "danger");
    }
  });
}

// Clean subtopic text by stripping leading numbering or list symbols
function cleanTopicName(topicStr) {
  if (!topicStr) return "";
  return topicStr.replace(/^([-\*\+•\s]*|[\d\.\s]+)/g, "").trim();
}

// Split the weekly syllabus text seimbang-seimbang into 3 sessions
function distributeSyllabus(syllabusText) {
  if (!syllabusText) {
    return { s1: [], s2: [], s3: [] };
  }
  
  const lines = syllabusText.split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const N = lines.length;
  
  if (N === 0) {
    return { s1: [], s2: [], s3: [] };
  } else if (N === 1) {
    return { s1: [lines[0]], s2: [lines[0]], s3: [lines[0]] };
  } else if (N === 2) {
    return { s1: [lines[0]], s2: [lines[1]], s3: [lines[0], lines[1]] };
  } else {
    const limit1 = Math.ceil(N / 3);
    const limit2 = Math.ceil((2 * N) / 3);
    
    return {
      s1: lines.slice(0, limit1),
      s2: lines.slice(limit1, limit2),
      s3: lines.slice(limit2)
    };
  }
}

// Format the subtopics list into a string
function joinTopics(topicsArray) {
  const cleaned = topicsArray
    .map(cleanTopicName)
    .filter(t => t.length > 0);
    
  if (cleaned.length === 0) {
    return state.language === "BM" ? "[Sub-topik pembelajaran]" : "[Sub-topics of learning]";
  }
  if (cleaned.length === 1) {
    return cleaned[0];
  }
  
  const andWord = state.language === "BM" ? " dan " : " and ";
  
  if (cleaned.length === 2) {
    return `${cleaned[0]}${andWord}${cleaned[1]}`;
  }
  
  const last = cleaned.pop();
  return `${cleaned.join(", ")},${andWord}${last}`;
}

// Render Sidebar distribution panel
function renderDistribution(dist) {
  const container = document.getElementById("distribution-viewer");
  container.innerHTML = "";
  
  const lang = state.language || "BM";
  
  if (dist.s1.length === 0 && dist.s2.length === 0 && dist.s3.length === 0) {
    const placeholder = translations[lang]["desc-agihan-placeholder"];
    container.innerHTML = `<div style="color: var(--text-light); text-align: center; padding: 1rem; font-size: 0.8rem;">${placeholder}</div>`;
    return;
  }
  
  const renderSessionBox = (num, title, items) => {
    const sBox = document.createElement("div");
    sBox.className = `dist-session s${num}`;
    
    let listHTML = "";
    if (items.length === 0) {
      listHTML = lang === "BM" ? "<li>[Tiada sub-topik ditugaskan]</li>" : "<li>[No sub-topics assigned]</li>";
    } else {
      items.forEach(item => {
        listHTML += `<li title="${escapeHTML(item)}">${escapeHTML(item)}</li>`;
      });
    }
    
    sBox.innerHTML = `
      <h5>Sesi ${num} (${title})</h5>
      <ul>${listHTML}</ul>
    `;
    container.appendChild(sBox);
  };
  
  const s1Sub = lang === "BM" ? "Kelas 2 Jam" : "2-Hour Class";
  const s2Sub = lang === "BM" ? "Kelas 2 Jam" : "2-Hour Class";
  const s3Sub = lang === "BM" ? "Kelas 1 Jam" : "1-Hour Class";
  
  renderSessionBox(1, s1Sub, dist.s1);
  renderSessionBox(2, s2Sub, dist.s2);
  renderSessionBox(3, s3Sub, dist.s3);
}

// Update UI based on Current Week
function updateWeekView() {
  document.getElementById("week-label").textContent = state.language === "BM" ? `Minggu ${state.currentWeek}` : `Week ${state.currentWeek}`;
  document.getElementById("syllabus-week-label").textContent = state.language === "BM" ? `Minggu ${state.currentWeek}` : `Week ${state.currentWeek}`;
  
  updateUILanguage();

  // Load weekly syllabus
  const weekSyllabus = state.weeklySyllabus[state.currentWeek] || "";
  document.getElementById("syllabus-raw").value = weekSyllabus;

  // Distribute and Render
  const dist = distributeSyllabus(weekSyllabus);
  renderDistribution(dist);

  // Populate parameters for 3 sessions
  for (let s = 1; s <= 3; s++) {
    const key = `w${state.currentWeek}_s${s}`;
    const record = state.records[key] || getSessionDefaults(s);
    
    document.getElementById(`s${s}-date`).value = record.date || "";
    document.getElementById(`s${s}-type`).value = record.type || (s === 3 ? "tutorial" : "amali");
    document.getElementById(`s${s}-attendance-present`).value = record.present !== undefined ? record.present : 28;
    document.getElementById(`s${s}-attendance-total`).value = record.total !== undefined ? record.total : 30;
    
    const understandingVal = record.understanding !== undefined ? record.understanding : (s === 3 ? 90 : (s === 2 ? 80 : 85));
    document.getElementById(`s${s}-understanding`).value = understandingVal;
    document.getElementById(`s${s}-understanding-val`).textContent = understandingVal + "%";
    
    document.getElementById(`s${s}-issue`).value = record.issue || "tiada";
  }

  // Load compiled weekly texts from state
  const weekKey = `w${state.currentWeek}_compiled`;
  const savedCompiled = state.records[weekKey];
  
  if (savedCompiled && savedCompiled.notes && savedCompiled.reflection && savedCompiled.cqi) {
    document.getElementById("compiled-notes-output").value = savedCompiled.notes;
    document.getElementById("compiled-reflection-output").value = savedCompiled.reflection;
    document.getElementById("compiled-cqi-output").value = savedCompiled.cqi;
  } else {
    triggerAutoCompiledGeneration();
  }
}

// Get sensible default inputs for a class session
function getSessionDefaults(sessionNum) {
  return {
    date: "",
    type: sessionNum === 3 ? "tutorial" : (sessionNum === 2 ? "amali" : "kuliah"),
    present: 28,
    total: 30,
    understanding: sessionNum === 3 ? 90 : (sessionNum === 2 ? 80 : 85),
    issue: "tiada"
  };
}

// Trigger auto compiled generation for the whole week
function triggerAutoCompiledGeneration() {
  const weekSyllabus = document.getElementById("syllabus-raw").value;
  const dist = distributeSyllabus(weekSyllabus);
  
  renderDistribution(dist);
  
  let notesText = "";
  let reflectionText = "";
  let cqiText = "";

  const topicsMapped = {
    1: joinTopics(dist.s1),
    2: joinTopics(dist.s2),
    3: joinTopics(dist.s3)
  };

  for (let s = 1; s <= 3; s++) {
    const dateVal = document.getElementById(`s${s}-date`).value;
    const dateFormatted = formatDateToLocal(dateVal);
    const type = document.getElementById(`s${s}-type`).value;
    const present = parseInt(document.getElementById(`s${s}-attendance-present`).value) || 0;
    const total = parseInt(document.getElementById(`s${s}-attendance-total`).value) || 0;
    const understanding = parseInt(document.getElementById(`s${s}-understanding`).value) || 0;
    const issue = document.getElementById(`s${s}-issue`).value;

    const topicForSession = topicsMapped[s];
    const generated = generateSessionSentences(s, type, topicForSession, present, total, understanding, issue);
    
    notesText += `${dateFormatted}\n${generated.notes}\n`;
    reflectionText += `${dateFormatted}\n${generated.reflection}\n`;
    cqiText += `${dateFormatted}\n${generated.cqi}\n`;
  }

  document.getElementById("compiled-notes-output").value = notesText.trim();
  document.getElementById("compiled-reflection-output").value = reflectionText.trim();
  document.getElementById("compiled-cqi-output").value = cqiText.trim();

  saveOutputsToState();
}

// Save outputs back to state
function saveOutputsToState() {
  state.weeklySyllabus[state.currentWeek] = document.getElementById("syllabus-raw").value;

  for (let s = 1; s <= 3; s++) {
    const key = `w${state.currentWeek}_s${s}`;
    state.records[key] = {
      date: document.getElementById(`s${s}-date`).value,
      type: document.getElementById(`s${s}-type`).value,
      present: parseInt(document.getElementById(`s${s}-attendance-present`).value) || 0,
      total: parseInt(document.getElementById(`s${s}-attendance-total`).value) || 0,
      understanding: parseInt(document.getElementById(`s${s}-understanding`).value) || 0,
      issue: document.getElementById(`s${s}-issue`).value
    };
  }

  const weekKey = `w${state.currentWeek}_compiled`;
  state.records[weekKey] = {
    notes: document.getElementById("compiled-notes-output").value,
    reflection: document.getElementById("compiled-reflection-output").value,
    cqi: document.getElementById("compiled-cqi-output").value
  };

  saveToLocalStorage();
}

// The Core Sentence Generator with Cross-Week Phrase Rotation & Bilingual Support
function generateSessionSentences(sessionNum, type, topic, present, total, understanding, issue) {
  const lang = state.language || "BM";
  const variantIndex = (state.currentWeek + sessionNum) % 3;

  if (lang === "EN") {
    return generateEnglishSentences(sessionNum, type, topic, present, total, understanding, issue, variantIndex);
  } else {
    return generateMalaySentences(sessionNum, type, topic, present, total, understanding, issue, variantIndex);
  }
}

// English Sentence Library
function generateEnglishSentences(sessionNum, type, topic, present, total, understanding, issue, variantIndex) {
  let notes = "";
  let reflection = "";
  let cqi = "";

  // 1. NOTES
  if (type === "tangguh") {
    const tangguhEN = [
      "The class session was postponed due to a public holiday. Syllabus coverage will be adjusted accordingly.",
      "The lab session was deferred owing to festive celebrations. Students were assigned offline self-study tasks.",
      "The tutorial/quiz session was postponed due to official college duties. A makeup class will be arranged."
    ];
    notes = tangguhEN[variantIndex];
  } else {
    if (type === "kuliah") {
      const kuliahEN = [
        `Delivered the theoretical lecture on the sub-topics: "${topic}". The explanation session utilized slide presentations and teaching module references for students' initial understanding.`,
        `Conducted a face-to-face theoretical lecture discussing the sub-topics: "${topic}". The explanation focused on slide notes and industry case studies to link theory with real-world practices.`,
        `Presented and discussed key concepts of the sub-topics: "${topic}". Students were given detailed explanations of the theoretical aspects and a module overview.`
      ];
      notes = kuliahEN[variantIndex];
    } else if (type === "amali") {
      const amaliEN = [
        `Conducted an initial practical demonstration for the sub-topics: "${topic}". Students commenced their lab work using the distributed task sheets.`,
        `Held a hands-on practical session for the sub-topics: "${topic}". Students performed system configuration and code building tasks in stages.`,
        `The lab session focused on the practical application of the sub-topics: "${topic}". Students built and tested their systems under the lecturer's guidance.`
      ];
      notes = amaliEN[variantIndex];
    } else if (type === "tutorial") {
      const tutorialEN = [
        `Held a tutorial session discussing written exercises and basic concepts for the sub-topics: "${topic}".`,
        `Facilitated a tutorial class reviewing homework and analytical problem-solving related to the sub-topics: "${topic}".`,
        `Students discussed tutorial problems for the sub-topics: "${topic}". The lecturer reviewed answers interactively on the whiteboard.`
      ];
      notes = tutorialEN[variantIndex];
    } else { // quiz
      const kuizEN = [
        `Administered a 30-minute written quiz to assess theoretical understanding of the sub-topics: "${topic}", followed by a review of the questions.`,
        `Conducted a hands-on practical test in the lab to evaluate students' coding and configuration skills for the sub-topics: "${topic}".`,
        `Managed an interactive online quiz using gaming platforms to quickly recap the sub-topics: "${topic}".`
      ];
      notes = kuizEN[variantIndex];
    }
  }

  // 2. REFLECTION
  if (type === "tangguh") {
    const refTangguhEN = [
      "Session cancelled. Students were advised to access slide notes and learning materials on Google Classroom.",
      "Practical deferred. Students were provided with written lab guides to try independently.",
      "Official lecturer duties. Tutorial tasks were assigned to students to complete individually."
    ];
    const cqiTangguhEN = [
      "A makeup class will be arranged at a suitable date to ensure smooth syllabus coverage.",
      "The lab task schedule will be adjusted, and extra guidance will be integrated into next week's session.",
      "Tutorial answers will be discussed in the opening minutes of the next class."
    ];
    return { 
      notes, 
      reflection: refTangguhEN[variantIndex], 
      cqi: cqiTangguhEN[variantIndex] 
    };
  }

  // Attendance
  let attText = "";
  if (present === total) {
    const attAllEN = [
      `All students (${present}/${total}) were present and showed full commitment. `,
      `Attendance was full (${present}/${total} students) for this session. `,
      `All students (${present}/${total}) attended the class punctually. `
    ];
    attText = attAllEN[variantIndex];
  } else {
    attText = `${present}/${total} students attended the class. `;
  }

  // Understanding
  let undText = "";
  if (understanding >= 90) {
    const undHighEN = [
      `Students' theoretical understanding of the sub-topics was excellent. They actively participated and answered questions correctly.`,
      `Students demonstrated excellent capabilities. Most of them were able to explain the sub-topics correctly.`,
      `Class feedback was highly positive. Students displayed high interest and no issues were detected in understanding the concepts.`
    ];
    undText = undHighEN[variantIndex];
  } else if (understanding >= 75) {
    const undMidHighEN = [
      `Most students understood the core concepts well and participated actively in discussions.`,
      `Students' comprehension level was satisfactory. A few students needed minor clarifications on sub-topics.`,
      `Students managed to grasp most of the content but still required references to module notes.`
    ];
    undText = undMidHighEN[variantIndex];
  } else if (understanding >= 50) {
    const undMidEN = [
      `Students showed moderate understanding. A few abstract concepts had to be repeated using simple analogies.`,
      `Practical grasp was acceptable, but students required constant supervision during implementation.`,
      `Some students lacked confidence and needed to refer to their notes repeatedly to answer questions.`
    ];
    undText = undMidEN[variantIndex];
  } else {
    const undLowEN = [
      `Students struggled to grasp the theoretical concepts. They appeared confused by the newly introduced terms.`,
      `Students faced difficulty working independently and made frequent syntax errors during the task.`,
      `Class feedback indicates a weak understanding. Response rate during recap questions was slow.`
    ];
    undText = undLowEN[variantIndex];
  }

  // Issues
  let issueText = "";
  switch (issue) {
    case "fokus":
      const issFokusEN = [
        ` A few students at the back lacked concentration and required direct reminders from the lecturer.`,
        ` Some students were distracted and lost focus towards the end of the class.`,
        ` Student attention was inconsistent, requiring frequent prompts to keep them engaged.`
      ];
      issueText = issFokusEN[variantIndex];
      break;
    case "faham":
      const issFahamEN = [
        ` Students took a considerable amount of time to understand the logical flow of this topic.`,
        ` Explanations had to be repeated multiple times as students struggled with coding logic.`,
        ` Students required extra time to connect theoretical concepts to the practical tasks.`
      ];
      issueText = issFahamEN[variantIndex];
      break;
    case "teknikal":
      const issTeknikalEN = [
        ` Slow internet connection in the lab limited students' access to online resources.`,
        ` Technical issues occurred on lab PCs and local server access, slowing down progress.`,
        ` Hardware and software licensing issues in the lab slightly disrupted the session.`
      ];
      issueText = issTeknikalEN[variantIndex];
      break;
    case "masa":
      const issMasaEN = [
        ` The 2-hour duration was insufficient to cover the final Q&A session thoroughly.`,
        ` The lab task was slightly too long for the allocated time, leaving some parts incomplete.`,
        ` The 1-hour tutorial was too short to discuss all review questions in detail.`
      ];
      issueText = issMasaEN[variantIndex];
      break;
    case "kehadiran":
      const issKehadiranEN = [
        ` Low attendance by a few students slightly affected the team discussion dynamics.`,
        ` The poor attendance rate limited the effectiveness of the group activities.`,
        ` Several students were absent due to health reasons or personal matters.`
      ];
      issueText = issKehadiranEN[variantIndex];
      break;
    default:
      const issNormalEN = [
        ` The session went very smoothly and the classroom environment was conducive.`,
        ` The learning process concluded on schedule in an orderly manner.`,
        ` Excellent two-way interaction between the lecturer and students throughout the class.`
      ];
      issueText = issNormalEN[variantIndex];
  }

  reflection = `${attText}${undText}${issueText}`;

  // 3. CQI
  if (issue === "teknikal") {
    const cqiTeknikalEN = [
      `Requested the IT department to check the lab network quality and prepared offline resources for the next class.`,
      `Reported the faulty PCs to the lab technician and advised students to bring their own laptops as backups.`,
      `Provided downloadable PDF resource packages to reduce dependence on the live lab network.`
    ];
    cqi = cqiTeknikalEN[variantIndex];
  } else if (issue === "masa") {
    const cqiMasaEN = [
      `Plan to condense the slides and start the lecture promptly to maximize Q&A time.`,
      `Split the lab sheet into smaller modules and assigned the remaining parts as homework.`,
      `Adjusted the timeline for the next class to allocate more time for hands-on troubleshooting.`
    ];
    cqi = cqiMasaEN[variantIndex];
  } else if (issue === "kehadiran") {
    const cqiKehadiranEN = [
      `Instructed the class representative to contact absent students to ensure they catch up on lecture notes.`,
      `Monitored attendance closely and shared slides directly with absent students.`,
      `Will contact persistently absent students and arrange a brief consultation meeting during office hours.`
    ];
    cqi = cqiKehadiranEN[variantIndex];
  } else if (issue === "fokus") {
    const cqiFokusEN = [
      `Shuffled student seating arrangements randomly and will include quick pop quizzes to maintain engagement.`,
      `Adopted active learning methods such as random discussions to keep students alert.`,
      `Will limit the use of unrelated personal devices during teaching hours.`
    ];
    cqi = cqiFokusEN[variantIndex];
  } else if (issue === "faham") {
    const cqiFahamEN = [
      `Prepared a quick-reference cheat sheet to help students grasp the topic before the lab.`,
      `Provided simplified boilerplate code templates before moving to complex exercises.`,
      `Plan a short 10-minute recap of foundational concepts before the next class.`
    ];
    cqi = cqiFahamEN[variantIndex];
  } else {
    if (understanding >= 90) {
      const cqiHighEN = [
        `Proceeding to the next topic in the syllabus. Additional resources have been uploaded to GC.`,
        `Providing advanced enrichment tasks to challenge high-performing students.`,
        `Maintaining current teaching strategies and encouraging peer tutoring for slower learners.`
      ];
      cqi = cqiHighEN[variantIndex];
    } else if (understanding >= 75) {
      const cqiMidHighEN = [
        `Will provide a quick review quiz at the start of next week's session to consolidate concepts.`,
        `Shared quick homework sheets to reinforce this week's learning before introducing new topics.`,
        `Clarified common mistakes found in tutorial answers to ensure clear understanding.`
      ];
      cqi = cqiMidHighEN[variantIndex];
    } else if (understanding >= 50) {
      const cqiMidEN = [
        `Encouraging peer-tutoring groups in the lab and guiding weaker students individually during tutorial slots.`,
        `Shared screen-recorded demonstrations for self-paced review at home.`,
        `Plan a focused small-group discussion for students struggling with practical tasks.`
      ];
      cqi = cqiMidEN[variantIndex];
    } else {
      const cqiLowEN = [
        `Slowing down the teaching pace next week. Will print pocket notes and organize a special recap session.`,
        `Implementing a dedicated remedial session for critical concepts before progressing further.`,
        `Providing graded exercises from simple to complex to build students' confidence.`
      ];
      cqi = cqiLowEN[variantIndex];
    }
  }

  return { notes, reflection, cqi };
}

// Malay Sentence Library
function generateMalaySentences(sessionNum, type, topic, present, total, understanding, issue, variantIndex) {
  let notes = "";
  let reflection = "";
  let cqi = "";

  // 1. NOTES
  if (type === "tangguh") {
    const tangguhMS = [
      "Sesi kelas ditangguhkan kerana cuti umum/kelepasan am. Kandungan sub-topik akan diselaraskan semula.",
      "Kelas ditunda disebabkan oleh kelepasan hari perayaan. Pelajar diberikan bahan bacaan secara luar talian.",
      "Sesi ditangguhkan berikutan kekangan urusan rasmi kolej. Sesi ganti kelas akan diaturkan kelak."
    ];
    notes = tangguhMS[variantIndex];
  } else {
    if (type === "kuliah") {
      const kuliahMS = [
        `Menyampaikan kuliah teori bagi sub-topik "${topic}". Sesi penerangan menggunakan slaid pembentangan berserta rujukan modul pengajaran bagi pemahaman awal pelajar.`,
        `Sesi kuliah teori secara bersemuka membincangkan sub-topik "${topic}". Penerangan berpandukan slaid pengajaran serta contoh kes industri bagi mengaitkan konsep dengan amalan sebenar.`,
        `Pembentangan dan perbincangan konsep utama bagi sub-topik "${topic}". Pelajar diberi penjelasan terperinci mengenai aspek teori dan gambaran keseluruhan modul pengajaran.`
      ];
      notes = kuliahMS[variantIndex];
    } else if (type === "amali") {
      const amaliMS = [
        `Melaksanakan demonstrasi praktikal langkah awal bagi sub-topik "${topic}". Pelajar mula melakukan latihan berpandukan lembaran kerja makmal yang diedarkan.`,
        `Menjalankan sesi amali hands-on bagi sub-topik "${topic}". Pelajar melaksanakan konfigurasi dan pembinaan kod sistem mengikut tugasan makmal secara berperingkat.`,
        `Sesi praktikal makmal memfokuskan kepada aplikasi sub-topik "${topic}". Pelajar membina dan menguji kod aplikasi masing-masing dengan bimbingan pensyarah.`
      ];
      notes = amaliMS[variantIndex];
    } else if (type === "tutorial") {
      const tutorialMS = [
        `Sesi perbincangan latihan bertulis dan ulasan modul tutorial bagi sub-topik "${topic}". Pelajar menyelesaikan soalan konsep asas.`,
        `Mengendalikan kelas tutorial bagi membincangkan soalan ulasan dan penyelesaian masalah analitik berkaitan sub-topik "${topic}".`,
        `Pelajar membincangkan tugasan dan soalan tutorial sub-topik "${topic}". Pensyarah membuat semakan jawapan secara interaktif di papan putih.`
      ];
      notes = tutorialMS[variantIndex];
    } else { // kuiz
      const kuizMS = [
        `Menjalankan penilaian kuiz bertulis (30 minit) bagi menguji kefahaman konsep asas teori bagi sub-topik "${topic}" disusuli ulasan jawapan.`,
        `Melaksanakan ujian praktikal hands-on di makmal bagi menilai tahap penguasaan kemahiran pengekodan pelajar bagi sub-topik "${topic}".`,
        `Kuiz ringkas atas talian menggunakan platform interaktif bagi menguji ingatan pelajar terhadap sub-topik "${topic}" secara cepat.`
      ];
      notes = kuizMS[variantIndex];
    }
  }

  // 2. REFLECTION
  if (type === "tangguh") {
    const refTangguhMS = [
      "Sesi dibatalkan. Pelajar diminta mengakses bahan nota dan video pembentangan di platform Google Classroom secara kendiri.",
      "Amali ditangguhkan. Pelajar diberi panduan tugasan amali secara bertulis untuk dicoba di luar waktu kelas.",
      "Urusan rasmi pensyarah di jabatan. Bahan tugasan tutorial telah diberikan untuk disiapkan oleh pelajar secara individu."
    ];
    const cqiTangguhMS = [
      "Sesi kuliah ganti (makeup class) akan diaturkan pada tarikh yang sesuai bagi memastikan silibus berjalan lancar.",
      "Tugasan amali diselaraskan semula dan bimbingan tambahan akan diselitkan semasa sesi lab minggu hadapan.",
      "Jawapan tugasan akan dibincangkan pada minit-minit awal kelas pertama minggu hadapan."
    ];
    return { 
      notes, 
      reflection: refTangguhMS[variantIndex], 
      cqi: cqiTangguhMS[variantIndex] 
    };
  }

  // Attendance
  let attText = "";
  if (present === total) {
    const attAllMS = [
      `Semua pelajar (${present}/${total}) hadir memberi komitmen penuh. `,
      `Kehadiran adalah penuh (${present}/${total} pelajar) untuk sesi ini. `,
      `Kesemua pelajar (${present}/${total}) hadir ke kelas dengan menepati masa. `
    ];
    attText = attAllMS[variantIndex];
  } else {
    attText = `${present}/${total} pelajar hadir. `;
  }

  // Understanding
  let undText = "";
  if (understanding >= 90) {
    const undHighMS = [
      `Kefahaman teori pelajar terhadap sub-topik ini berada pada tahap cemerlang. Pelajar aktif memberi respons serta menjawab soalan interaktif dengan betul.`,
      `Pelajar menunjukkan penguasaan yang sangat baik terhadap konsep yang diajar. Kebanyakan mereka berupaya menerangkan semula sub-topik dengan tepat.`,
      `Maklum balas kelas sangat memuaskan. Pelajar menunjukkan minat yang tinggi dan tiada masalah dikesan dalam memahami kandungan pelajaran.`
    ];
    undText = undHighMS[variantIndex];
  } else if (understanding >= 75) {
    const undMidHighMS = [
      `Majoriti pelajar memahami konsep asas bagi sub-topik dengan baik serta aktif dalam perbincangan.`,
      `Tahap kefahaman pelajar berada pada tahap memuaskan. Segelintir pelajar memerlukan penjelasan tambahan bagi beberapa sub-konsep.`,
      `Pelajar dapat menguasai sebahagian besar kandungan sub-topik, namun masih memerlukan rujukan nota modul.`
    ];
    undText = undMidHighMS[variantIndex];
  } else if (understanding >= 50) {
    const undMidMS = [
      `Pelajar menunjukkan tahap kefahaman yang sederhana. Beberapa konsep abstrak perlu diulang semula menggunakan analogi.`,
      `Tahap penguasaan pelajar adalah memuaskan namun memerlukan pemantauan berterusan semasa fasa praktikal dijalankan.`,
      `Sebahagian pelajar kelihatan kurang yakin dan memerlukan rujukan nota berulang kali untuk menjawab soalan.`
    ];
    undText = undMidMS[variantIndex];
  } else {
    const undLowMS = [
      `Tahap penguasaan pelajar terhadap sub-topik ini sangat rendah. Pelajar didapati keliru dengan istilah-istilah baharu.`,
      `Pelajar menghadapi kesukaran yang ketara untuk memahami teori yang dibentangkan. Sesi kelas terpaksa berjalan dengan lebih perlahan.`,
      `Maklum balas pelajar menunjukkan kelemahan dalam memahami asas tajuk ini. Ramai pelajar memerlukan bimbingan pemulihan.`
    ];
    undText = undLowMS[variantIndex];
  }

  // Issues
  let issueText = "";
  if (issue === "fokus") {
    const issFokusMS = [
      ` Terdapat gangguan tumpuan daripada beberapa orang pelajar di barisan belakang yang bersembang.`,
      ` Segelintir pelajar didapati kurang fokus dan leka di akhir sesi pembelajaran.`,
      ` Tumpuan pelajar kurang konsisten dan pensyarah perlu kerap menegur untuk menarik fokus mereka.`
    ];
    issueText = issFokusMS[variantIndex];
  } else if (issue === "faham") {
    const issFahamMS = [
      ` Pelajar mengambil masa yang agak lama untuk memahami konsep logik aliran sub-topik teori ini.`,
      ` Penerangan terpaksa diulang beberapa kali kerana pelajar lambat menangkap konsep logik sistem.`,
      ` Pelajar memerlukan masa tambahan bagi menghubungkaitkan teori dengan amali.`
    ];
    issueText = issFahamMS[variantIndex];
  } else if (issue === "teknikal") {
    const issTeknikalMS = [
      ` Kelembapan sistem rangkaian dewan makmal mengehadkan carian bahan rujukan pelajar.`,
      ` Terdapat gangguan teknikal pada komputer makmal dan capaian pelayan tempatan.`,
      ` Masalah perkakasan dan lesen perisian makmal sedikit sebanyak menjejaskan kelancaran kelas.`
    ];
    issueText = issTeknikalMS[variantIndex];
  } else if (issue === "masa") {
    const issMasaMS = [
      ` Kekangan masa 2 jam mengehadkan sesi soal jawab bagi sub-topik terakhir.`,
      ` Masa yang diperuntukkan didapati suntuk untuk menamatkan keseluruhan latihan kelas.`,
      ` Pensyarah terpaksa mempercepatkan sesi rumusan disebabkan kekurangan masa di akhir waktu.`
    ];
    issueText = issMasaMS[variantIndex];
  } else if (issue === "kehadiran") {
    const issKehadiranMS = [
      ` Ketidakhadiran beberapa pelajar menjejaskan sedikit keaktifan kelas perbincangan.`,
      ` Peratus kehadiran yang kurang memuaskan mengehadkan keberkesanan aktiviti kumpulan.`,
      ` Beberapa orang pelajar tidak hadir kelas atas sebab-sebab kesihatan dan urusan peribadi.`
    ];
    issueText = issKehadiranMS[variantIndex];
  } else {
    const issNormalMS = [
      ` Sesi P&P berjalan dengan amat lancar dan persekitaran kelas sangat kondusif.`,
      ` Proses pembelajaran dapat ditamatkan mengikut jadual dalam keadaan yang teratur.`,
      ` Interaksi dua hala di antara pensyarah dan pelajar adalah cemerlang sepanjang sesi.`
    ];
    issueText = issNormalMS[variantIndex];
  }

  reflection = `${attText}${undText}${issueText}`;

  // 3. CQI
  if (issue === "teknikal") {
    const cqiTeknikalMS = [
      `Meminta pihak IT memeriksa kualiti rangkaian makmal dan menyediakan modul teori bertulis luar talian (offline) sebagai sandaran kelas hadapan.`,
      `Mengambil tindakan melaporkan masalah komputer makmal kepada juruteknik dan menyarankan pelajar menggunakan komputer riba sendiri untuk sementara.`,
      `Menyediakan bahan sokongan dalam format PDF boleh dimuat turun awal bagi mengurangkan kebergantungan kepada rangkaian langsung makmal.`
    ];
    cqi = cqiTeknikalMS[variantIndex];
  } else if (issue === "masa") {
    const cqiMasaMS = [
      `Merancang untuk memampatkan slaid teori dan memulakan kuliah tepat pada masanya bagi memaksimumkan sesi soal jawab.`,
      `Membahagikan modul latihan kepada pecahan lebih kecil dan meminta pelajar menyiapkan bahagian selebihnya di rumah.`,
      `Mengubah suai perancangan masa kelas hadapan dengan memperuntukkan lebih banyak ruang untuk sesi tutorial ringkas.`
    ];
    cqi = cqiMasaMS[variantIndex];
  } else if (issue === "kehadiran") {
    const cqiKehadiranMS = [
      `Memaklumkan ketua kelas untuk menghubungi pelajar tidak hadir bagi memastikan mereka mengambil nota kuliah.`,
      `Merekod dan memantau status kehadiran pelajar rapat serta menghantar bahan kuliah terus kepada pelajar yang tidak hadir.`,
      `Menhubungi pelajar yang culas hadir dan meminta mereka berjumpa pensyarah semasa waktu rundingan.`
    ];
    cqi = cqiKehadiranMS[variantIndex];
  } else if (issue === "fokus") {
    const cqiFokusMS = [
      `Menukur susunan tempat duduk pelajar secara rawak serta memasukkan aktiviti soal jawab spontan bagi mengekalkan fokus.`,
      `Menerapkan kaedah pembelajaran aktif seperti perbincangan rawak bagi memastikan pelajar terus kekal peka.`,
      `Mengehadkan penggunaan peranti peribadi yang tidak berkaitan semasa sesi pengajaran berlangsung.`
    ];
    cqi = cqiFokusMS[variantIndex];
  } else if (issue === "faham") {
    const cqiFahamMS = [
      `Menyediakan lembaran ringkas bertulis (cheat sheet) untuk membantu pelajar memahami sub-topik sebelum kelas praktikal.`,
      `Menyediakan contoh kod asas yang lebih mudah untuk difahami pelajar sebelum beralih ke latihan yang lebih kompleks.`,
      `Merancang sesi ulang kaji pendek konsep asas selama 10 minit sebelum memulakan kelas hadapan.`
    ];
    cqi = cqiFahamMS[variantIndex];
  } else {
    if (understanding >= 90) {
      const cqiHighMS = [
        `Meneruskan rancangan mengajar ke topik yang seterusnya mengikut silibus. Nota tambahan dikongsi di platform e-pembelajaran.`,
        `Memberikan tugasan pengayaan (enrichment tasks) yang lebih mencabar untuk mengasah pemikiran kritis pelajar.`,
        `Mengekalkan kaedah penyampaian sedia ada dan mendorong pelajar membimbing rakan-rakan yang memerlukan.`
      ];
      cqi = cqiHighMS[variantIndex];
    } else if (understanding >= 75) {
      const cqiMidHighMS = [
        `Memberikan latihan pengukuhan ringkas sebelum memulakan topik baharu pada sesi akan datang bagi memantapkan kemahiran sedia ada.`,
        `Menyediakan kuiz ringkas di platform GC sebagai aktiviti pengukuhan luar kuliah.`,
        `Membuat perbincangan ringkas bagi soalan-soalan yang didapati rumit semasa sesi semakan amali.`
      ];
      cqi = cqiMidHighMS[variantIndex];
    } else if (understanding >= 50) {
      const cqiMidMS = [
        `Menyediakan sesi bimbingan rakan sebaya (peer-tutoring) di makmal dan membimbing pelajar yang lemah secara individu semasa kelas tutorial.`,
        `Mengedarkan nota poket tambahan dan meminta pelajar merujuk video demo praktikal yang telah disediakan.`,
        `Mengadakan sesi perbincangan kumpulan kecil bagi membetulkan kesilapan lazim dalam tugasan.`
      ];
      cqi = cqiMidMS[variantIndex];
    } else {
      const cqiLowMS = [
        `Memperlahankan tempo kuliah pada minggu hadapan. Menyediakan modul ringkas bercetak serta sesi ulang kaji khas bagi membina semula asas kefahaman pelajar.`,
        `Melaksanakan sesi pemulihan intensif (remedial class) berfokuskan kepada konsep-konsep kritikal sebelum meneruskan silibus.`,
        `Menyediakan set soalan latihan bertahap mudah kepada sukar secara berperingkat untuk membina keyakinan pelajar.`
      ];
      cqi = cqiLowMS[variantIndex];
    }
  }

  return { notes, reflection, cqi };
}

// Utility: Copy text to clipboard
function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage || "Teks disalin ke papan keratan!");
  }).catch(err => {
    console.error("Could not copy text: ", err);
    showToast("Gagal menyalin teks. Sila salin secara manual.", "danger");
  });
}

// Show Toast Message
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  
  toastMsg.textContent = message;
  
  if (type === "warning") {
    toast.style.borderLeftColor = "#f59e0b"; // orange
  } else if (type === "danger") {
    toast.style.borderLeftColor = "#ef4444"; // red
  } else {
    toast.style.borderLeftColor = "#2dd4bf"; // teal/green
  }
  
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Escape HTML utility
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Export Records to JSON
function exportData() {
  saveOutputsToState();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  
  const formattedSubject = state.subjectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  downloadAnchor.setAttribute("download", `rms_rekod_${formattedSubject}.json`);
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  showToast(state.language === "BM" ? "Rekod berjaya dieksport!" : "Records exported successfully!");
}

// Import Records from JSON
function importData(e) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedState = JSON.parse(event.target.result);
      if (importedState && typeof importedState === 'object') {
        state = { ...state, ...importedState };
        
        document.getElementById("lecturer-name").value = state.lecturerName || "";
        document.getElementById("subject-name").value = state.subjectName || "";
        document.getElementById("lecturer-name-display").textContent = state.lecturerName || "";
        
        updateWeekView();
        saveToLocalStorage();
        
        showToast(state.language === "BM" ? "Rekod berjaya diimport!" : "Records imported successfully!");
      }
    } catch (err) {
      console.error("Error reading JSON file", err);
      showToast(state.language === "BM" ? "Fail JSON tidak sah!" : "Invalid JSON file!", "danger");
    }
  };
  
  if (e.target.files.length > 0) {
    fileReader.readAsText(e.target.files[0]);
  }
}
