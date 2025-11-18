const { MilvusClient } = require('@zilliz/milvus2-sdk-node')

const milvus = new MilvusClient({ address: process.env.MILVUS_URL || 'localhost:19530' })

async function createCollection() {
  await milvus.createCollection({
    collection_name: 'materials',
    fields: [
      { name: 'id', data_type: 'Int64', is_primary_key: true, autoID: true },
      { name: 'embedding', data_type: 'FloatVector', dim: 384 },
      { name: 'text', data_type: 'VarChar', max_length: 5000 }
    ]
  })
  await milvus.createIndex({
    collection_name: 'materials',
    field_name: 'embedding',
    index_type: 'IVF_FLAT',
    metric_type: 'L2',
    params: { nlist: 128 }
  })
  await milvus.loadCollectionSync({ collection_name: 'materials' })
}

async function insertEmbedding(text, embedding) {
  await milvus.insert({
    collection_name: 'materials',
    fields_data: [{ text, embedding }]
  })
}

async function searchSimilar(embedding, topK = 5) {
  const res = await milvus.search({
    collection_name: 'materials',
    vector: embedding,
    topk: topK,
    output_fields: ['text'],
    metric_type: 'L2'
  })
  return res.results
}

module.exports = { createCollection, insertEmbedding, searchSimilar }