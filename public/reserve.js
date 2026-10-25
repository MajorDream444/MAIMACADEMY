// Founding-cohort reservation: free, no payment. Posts to the main site's
// signup endpoint, which adds the person to the cohort list in Resend.
const form = document.getElementById('reserve-form');
const status = document.getElementById('reserve-status');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { status.textContent = 'Enter a valid email address.'; return; }
  const button = form.querySelector('button'); button.disabled = true; status.textContent = 'Reserving…';
  try {
    const res = await fetch('https://www.majoraimindset.com/api/subscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name: form.first_name.value.trim(), website: form.website.value, cohort: true, source: 'academy-reserve' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    if (data.waitlisted !== true) {
      status.textContent = 'Your guide signup was received, but your cohort interest-list reservation was not confirmed. Please try again or contact contact@majoraimindset.com.';
      return;
    }
    form.reset();
    status.textContent = "You're on the founding cohort interest list. Payments open 11 November, subject to launch-readiness approval; the cohort begins 18 November. Joining the list does not guarantee one of the 20 paid places.";
  } catch (err) {
    status.textContent = `${err.message} You can also email contact@majoraimindset.com.`;
  } finally { button.disabled = false; }
});
