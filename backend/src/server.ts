import app from './app';

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
