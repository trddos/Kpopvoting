async function loadActivePolls() {
  const container = document.getElementById('live-polls-container');
  
  const { data: polls, error } = await supabase
    .from('polls')
    .select('*, contestants(*)')
    .eq('status', 'active');

  if (error || !polls.length) {
    container.innerHTML = "<p>No active polls right now!</p>";
    return;
  }

  container.innerHTML = polls.map(poll => `
    <div class="poll-card" id="poll-${poll.id}">
      <h2>${poll.title}</h2>
      <p>${poll.description || ''}</p>
      <div class="contestant-grid">
        ${poll.contestants.map(c => `
          <div class="contestant-card">
            <img src="${c.image_url || 'https://via.placeholder.com/150'}" alt="${c.name}">
            <h3>${c.name}</h3>
            <p>Votes: <span id="count-${c.id}">${c.vote_count}</span></p>
            <button onclick="submitVote('${poll.id}', '${c.id}')">VOTE</button>
          </div>
        `).join('')}
      </div>
      <div id="status-${poll.id}" class="cooldown-timer"></div>
    </div>
  `).join('');
}

async function submitVote(pollId, contestantId) {
  const statusEl = document.getElementById(`status-${pollId}`);
  
  const { data, error } = await supabase.rpc('cast_vote', {
    p_poll_id: pollId,
    p_contestant_id: contestantId,
    p_user_id: CURRENT_USER_ID
  });

  if (error) {
    alert("Error voting: " + error.message);
    return;
  }

  if (data.success) {
    alert("Vote Counted!");
    loadActivePolls(); // Refresh UI
  } else {
    statusEl.innerText = `⏳ ${data.message}`;
  }
}

document.addEventListener("DOMContentLoaded", loadActivePolls);
