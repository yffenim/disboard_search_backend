const request = require('supertest')
const app = require('../server')

describe('Search Endpoint', () => {
  it('should call the scraper', async () => {
    const res = await request(app)
      .post('/search')
      .send({
        tag1: "buffy",
        tag2: "angel"
      })
    // expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('post')
  })
})

