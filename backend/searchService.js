const { Client } = require('@elastic/elasticsearch')
const { query: pgQuery } = require('./db')

const es = new Client({ node: process.env.ES_URL || 'http://localhost:9200' })

async function indexMaterial(material) {
  await es.index({
    index: 'materials',
    id: material.material_id,
    body: {
      url: material.url,
      filename: material.filename,
      tags: material.tags,
      quality_score: material.quality_score,
      ipfs_hash: material.ipfs_hash
    }
  })
}

async function searchMaterials(q, filters = {}, userPrefs = {}) {
  const must = []
  if (q) must.push({ match: { _all: q } })
  if (filters.subject) must.push({ term: { 'tags.subject.keyword': filters.subject } })
  const body = await es.search({
    index: 'materials',
    body: {
      query: { bool: { must } },
      size: 20
    }
  })
  const hits = body.hits.hits.map(h => ({ id: h._id, ...h._source }))
  // 融合排序：60%偏好 + 40%质量
  return hits.map(h => ({
    ...h,
    rank: 0.6 * (userPrefs.format === h.tags.form ? 1 : 0.5) + 0.4 * (h.quality_score || 0)
  })).sort((a, b) => b.rank - a.rank)
}

module.exports = { indexMaterial, searchMaterials }