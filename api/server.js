// api/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const data = require('./data.json');

app.use(cors());
app.use(express.json());

app.get('/api/university/:id', (req, res) => {
  const id = req.params.id;
  const uni = data.universities.find(u => String(u.id) === String(id));
  if (!uni) return res.status(404).json({ error: 'Not found' });
  res.json(uni);
});

app.get('/api/fees/:courseId', (req, res) => {
  const cid = req.params.courseId;
  let found = null;
  data.universities.forEach(u => {
    u.courses.forEach(c => { if (String(c.id) === String(cid)) found = c; });
  });
  if (!found) return res.status(404).json({ error: 'course not found' });
  res.json({ course: found.name, fee_range: found.fee_range });
});

app.post('/api/leads', (req, res) => {
  // optional simple lead receiver for local testing
  const lead = req.body;
  console.log('Received lead:', lead);
  res.json({ status: 'ok', received: lead });
});

app.listen(port, () => console.log('API listening on', port));
