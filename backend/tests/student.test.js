const request = require('supertest');
const app = require('../server');
const { generateAccessToken } = require('../config/jwt');

describe('Student Management & RBAC Protection', () => {
  it('GET /api/web/admin/etudiants sans token doit être rejeté (401)', async () => {
    const res = await request(app).get('/api/web/admin/etudiants');
    expect(res.status).toBe(401);
  });

  it('GET /api/web/admin/etudiants avec token étudiant doit être interdit (403)', async () => {
    const studentToken = generateAccessToken({
      id: 1,
      role: 'etudiant',
      identifiant: '24GLO01IU',
    });

    const res = await request(app)
      .get('/api/web/admin/etudiants')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/web/admin/etudiants avec données invalides doit renvoyer 400 Bad Request', async () => {
    const adminToken = generateAccessToken({
      id: 1,
      role: 'admin',
      identifiant: 'admin@iut.cm',
    });

    const res = await request(app)
      .post('/api/web/admin/etudiants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nom: 'T', // trop court
        // prenom manquant
        matricule: '24',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('errors');
  });
});
