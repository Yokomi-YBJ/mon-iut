const request = require('supertest');
const app = require('../server');
const { generateAccessToken } = require('../config/jwt');

describe('Auth Endpoints & Security Checks', () => {
  it('GET /health devrait renvoyer le statut du service', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBeDefined();
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('uptimeSeconds');
  });

  it('POST /api/auth/login sans identifiants devrait renvoyer 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login avec mot de passe erroné devrait renvoyer 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifiant: 'utilisateur_inexistant@iut.cm',
        password: 'mauvais_mot_de_passe',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me sans en-tête Authorization devrait renvoyer 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me avec token JWT valide devrait renvoyer le profil de l\'utilisateur', async () => {
    const token = generateAccessToken({
      id: 99,
      role: 'admin',
      identifiant: 'admin_test@iut.cm',
      nom: 'Test Admin',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.identifiant).toBe('admin_test@iut.cm');
    expect(res.body.user.role).toBe('admin');
  });

  it('POST /api/auth/refresh sans token devrait renvoyer 400', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({});
    expect(res.status).toBe(400);
  });
});
