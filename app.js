// Local persistent device identity generation
function getUserId() {
  let userId = localStorage.getItem('kpop_user_id');
  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('kpop_user_id', userId);
  }
  return userId;
}

const CURRENT_USER_ID = getUserId();
