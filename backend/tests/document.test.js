const request = require('supertest');
const app = require('../server');
const { generateAccessToken } = require('../config/jwt');

describe('Document Upload & Dispatch Security', () => {
  it('POST /api/web/admin/documents sans fichier doit être rejeté (400)', async () => {
    const adminToken = generateAccessToken({
      id: 1,
      role: 'admin',
      identifiant: 'admin@iut.cm',
    });

    const res = await request(app)
      .post('/api/web/admin/documents')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('titre', 'Règlement Intérieur');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/web/admin/documents avec fichier non-PDF doit être rejeté', async () => {
    const adminToken = generateAccessToken({
      id: 1,
      role: 'admin',
      identifiant: 'admin@iut.cm',
    });

    const res = await request(app)
      .post('/api/web/admin/documents')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('fichier', Buffer.from('console.log("hello");'), 'script.js');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
