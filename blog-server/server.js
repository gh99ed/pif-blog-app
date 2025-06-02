const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tfaRoutes = require('./routes/2faRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/2fa', tfaRoutes);
app.use('/posts', postRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


