let themeSelectorButton = document.getElementById('dark-mode-icon');

// Check and apply saved theme preference on page load
if (localStorage.getItem('blockies_theme') === 'dark') {
  document.body.classList.add('dark');
}

themeSelectorButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  // Save the user's preference in localStorage
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('blockies_theme', 'dark');
  } else {
    localStorage.setItem('blockies_theme', 'light');
  }
});
