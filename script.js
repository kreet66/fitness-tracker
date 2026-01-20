// Initialisierung
let entries = [];
let charts = {};

// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    // Aktuelles Datum anzeigen
    updateCurrentDate();
    
    // Heutiges Datum im Formular setzen
    document.getElementById('date').valueAsDate = new Date();
    
    // Daten aus LocalStorage laden
    loadData();
    
    // Form Submit Handler
    document.getElementById('dataForm').addEventListener('submit', handleSubmit);
    
    // Initial Verlauf anzeigen
    displayEntries();
});

// Aktuelles Datum anzeigen
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('de-DE', options);
}

// Tab-Wechsel
function showTab(tabName) {
    // Alle Tabs verstecken
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Alle Tab-Buttons deaktivieren
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Aktiven Tab anzeigen
    document.getElementById('tab-' + tabName).classList.add('active');
    
    // Aktiven Button markieren
    event.target.classList.add('active');
    
    // Bei Statistik-Tab: Charts aktualisieren
    if (tabName === 'statistik') {
        setTimeout(updateCharts, 100);
    }
}

// Formular absenden
function handleSubmit(e) {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('date').value,
        weight: parseFloat(document.getElementById('weight').value) || null,
        stress: parseInt(document.getElementById('stress').value) || null,
        steps: parseInt(document.getElementById('steps').value) || null,
        calories: parseInt(document.getElementById('calories').value) || null,
        protein: parseInt(document.getElementById('protein').value) || null,
        exercise: parseInt(document.getElementById('exercise').value) || null,
        water: parseFloat(document.getElementById('water').value) || null,
        notes: document.getElementById('notes').value || ''
    };
    
    // Prüfen ob Eintrag für dieses Datum schon existiert
    const existingIndex = entries.findIndex(e => e.date === entry.date);
    
    if (existingIndex >= 0) {
        // Existierenden Eintrag aktualisieren
        entries[existingIndex] = entry;
        alert('✅ Eintrag für ' + formatDate(entry.date) + ' aktualisiert!');
    } else {
        // Neuen Eintrag hinzufügen
        entries.push(entry);
        alert('✅ Eintrag für ' + formatDate(entry.date) + ' gespeichert!');
    }
    
    // Sortieren nach Datum (neueste zuerst)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Speichern und anzeigen
    saveData();
    displayEntries();
    
    // Formular zurücksetzen
    document.getElementById('dataForm').reset();
    document.getElementById('date').valueAsDate = new Date();
}

// Daten speichern (LocalStorage)
function saveData() {
    localStorage.setItem('fitnessTrackerData', JSON.stringify(entries));
}

// Daten laden (LocalStorage)
function loadData() {
    const stored = localStorage.getItem('fitnessTrackerData');
    if (stored) {
        entries = JSON.parse(stored);
    }
}

// Einträge anzeigen
function displayEntries() {
    const container = document.getElementById('entriesList');
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📝 Noch keine Einträge vorhanden.</p>
                <p>Wechsle zum "Eingabe"-Tab um deinen ersten Eintrag zu erstellen!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = entries.map(entry => `
        <div class="entry-item">
            <h3>📅 ${formatDate(entry.date)}</h3>
            <div class="entry-data">
                ${entry.weight ? `<div class="entry-data-item">⚖️ <strong>${entry.weight} kg</strong></div>` : ''}
                ${entry.stress ? `<div class="entry-data-item">😰 Stress: <strong>${entry.stress}/10</strong></div>` : ''}
                ${entry.steps ? `<div class="entry-data-item">👟 <strong>${entry.steps.toLocaleString('de-DE')} Schritte</strong></div>` : ''}
                ${entry.calories ? `<div class="entry-data-item">🔥 <strong>${entry.calories} kcal</strong></div>` : ''}
                ${entry.protein ? `<div class="entry-data-item">🥩 <strong>${entry.protein}g Protein</strong></div>` : ''}
                ${entry.exercise ? `<div class="entry-data-item">🏋️ <strong>${entry.exercise} Min. Sport</strong></div>` : ''}
                ${entry.water ? `<div class="entry-data-item">💧 <strong>${entry.water}L Wasser</strong></div>` : ''}
            </div>
            ${entry.notes ? `<p style="margin-top: 10px; font-style: italic;">"${entry.notes}"</p>` : ''}
            <div class="entry-actions">
                <button class="btn btn-secondary btn-small" onclick="editEntry('${entry.date}')">✏️ Bearbeiten</button>
                <button class="btn btn-danger btn-small" onclick="deleteEntry('${entry.date}')">🗑️ Löschen</button>
            </div>
        </div>
    `).join('');
}

// Eintrag bearbeiten
function editEntry(date) {
    const entry = entries.find(e => e.date === date);
    if (!entry) return;
    
    // Formular füllen
    document.getElementById('date').value = entry.date;
    document.getElementById('weight').value = entry.weight || '';
    document.getElementById('stress').value = entry.stress || '';
    document.getElementById('steps').value = entry.steps || '';
    document.getElementById('calories').value = entry.calories || '';
    document.getElementById('protein').value = entry.protein || '';
    document.getElementById('exercise').value = entry.exercise || '';
    document.getElementById('water').value = entry.water || '';
    document.getElementById('notes').value = entry.notes || '';
    
    // Zum Eingabe-Tab wechseln
    showTab('eingabe');
    document.querySelectorAll('.tab')[0].classList.add('active');
}

// Eintrag löschen
function deleteEntry(date) {
    if (!confirm('Möchtest du diesen Eintrag wirklich löschen?')) return;
    
    entries = entries.filter(e => e.date !== date);
    saveData();
    displayEntries();
    
    alert('✅ Eintrag gelöscht!');
}

// Datum formatieren
function formatDate(dateString) {
    const date = new Date(dateString + 'T12:00:00'); // Fix für Zeitzonen
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}

// Charts aktualisieren
function updateCharts() {
    // Zerstöre alte Charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    // Nur letzte 30 Tage
    const last30Days = entries.slice(0, 30).reverse();
    
    if (last30Days.length === 0) {
        document.querySelector('.stats-grid').innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>📊 Noch keine Daten für Statistiken vorhanden.</p>
            </div>
        `;
        return;
    }
    
    const labels = last30Days.map(e => {
        const d = new Date(e.date + 'T12:00:00');
        return d.getDate() + '.' + (d.getMonth() + 1) + '.';
    });
    
    // Gewicht Chart
    if (last30Days.some(e => e.weight)) {
        const ctx = document.getElementById('weightChart');
        charts.weight = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gewicht (kg)',
                    data: last30Days.map(e => e.weight),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Stress Chart
    if (last30Days.some(e => e.stress)) {
        const ctx = document.getElementById('stressChart');
        charts.stress = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stress (1-10)',
                    data: last30Days.map(e => e.stress),
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: '#dc3545',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }
    
    // Schritte Chart
    if (last30Days.some(e => e.steps)) {
        const ctx = document.getElementById('stepsChart');
        charts.steps = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Schritte',
                    data: last30Days.map(e => e.steps),
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: '#28a745',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Protein Chart
    if (last30Days.some(e => e.protein)) {
        const ctx = document.getElementById('proteinChart');
        charts.protein = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Protein (g)',
                    data: last30Days.map(e => e.protein),
                    borderColor: '#fd7e14',
                    backgroundColor: 'rgba(253, 126, 20, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// Daten exportieren
function exportData() {
    if (entries.length === 0) {
        alert('⚠️ Keine Daten zum Exportieren vorhanden!');
        return;
    }
    
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fitness-daten-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    
    alert('✅ Daten wurden exportiert!');
}

// Daten importieren
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                
                if (!Array.isArray(imported)) {
                    throw new Error('Ungültiges Format');
                }
                
                if (confirm('⚠️ Möchtest du die vorhandenen Daten überschreiben oder zusammenführen?\n\nOK = Zusammenführen\nAbbrechen = Abbrechen')) {
                    // Zusammenführen
                    imported.forEach(newEntry => {
                        const existingIndex = entries.findIndex(e => e.date === newEntry.date);
                        if (existingIndex >= 0) {
                            entries[existingIndex] = newEntry;
                        } else {
                            entries.push(newEntry);
                        }
                    });
                    
                    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
                    saveData();
                    displayEntries();
                    
                    alert('✅ Daten wurden importiert und zusammengeführt!');
                }
            } catch (error) {
                alert('❌ Fehler beim Importieren: Ungültige Datei!');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}
