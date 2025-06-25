document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('word-input');
    const resultArea = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const word = input.value.trim();
        if (!word) return;
        showSpinner();
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            if (!res.ok) throw new Error('Word not found');
            const data = await res.json();
            renderResult(word, data);
        } catch (err) {
            renderError(word);
        } finally {
            hideSpinner();
        }
    });

    function showSpinner() {
        if (spinner) spinner.style.display = 'block';
        resultArea.querySelectorAll(':scope > :not(.spinner)').forEach(el => el.remove());
    }

    function hideSpinner() {
        if (spinner) spinner.style.display = 'none';
    }

    function renderResult(word, data) {
        hideSpinner();
        const entry = data[0];
        let html = `<h2>${entry.word}</h2>`;
        if (entry.phonetics && entry.phonetics.length > 0 && entry.phonetics[0].text) {
            html += `<div style='color:#4f8cff;margin-bottom:8px;'>${entry.phonetics[0].text}</div>`;
        }
        entry.meanings.forEach(meaning => {
            html += `<div style='margin-bottom:12px;'><strong>${meaning.partOfSpeech}</strong><ul>`;
            meaning.definitions.forEach(def => {
                html += `<li>${def.definition}`;
                if (def.example) {
                    html += `<br><em style='color:#64748b;'>Example: ${def.example}</em>`;
                }
                html += `</li>`;
            });
            html += `</ul></div>`;
        });
        const temp = document.createElement('div');
        temp.innerHTML = html;
        resultArea.appendChild(temp);
    }

    function renderError(word) {
        hideSpinner();
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `<span style='color:#e53e3e;'>"${word}"is not found in dictionary. Please try another word.</span>`;
        resultArea.appendChild(errorDiv);
    }
}); 