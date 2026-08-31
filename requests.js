// js/requests.js
document.getElementById('requestForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const artistName = document.getElementById('artistName').value;
  const message = document.getElementById('message').value;

  const { error } = await supabase.from('requests').insert([
    { artist_name: artistName, message: message, user_id: CURRENT_USER_ID }
  ]);

  if (error) {
    alert("Error submitting request");
  } else {
    alert("Request submitted!");
    e.target.reset();
  }
});
