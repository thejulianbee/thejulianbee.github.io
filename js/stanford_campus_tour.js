// js/stanford_campus_tour.js
document.addEventListener('DOMContentLoaded', () => {
    const textWrapper = document.getElementById('textWrapper');
    const textOverlay = document.getElementById('textOverlay');

    if (textOverlay && textWrapper) {
        textOverlay.addEventListener('click', () => {
            textWrapper.classList.remove('initially-hidden');
            textWrapper.classList.add('revealed');
            textOverlay.classList.add('hidden');
        });
    }
});