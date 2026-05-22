import cors from 'cors';

cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedPattern = /^http:\/\/([a-zA-Z0-9-]+)\.localhost:3000$/;

    if (origin === 'http://localhost:3000' || allowedPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

export default cors;
