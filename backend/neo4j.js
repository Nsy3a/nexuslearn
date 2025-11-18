const neo4j = require('neo4j-driver')

const driver = neo4j.driver(
  process.env.NEO4J_URL || 'bolt://localhost:7687',
  neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'nexus')
)

async function addKnowledgeNode(label, props) {
  const session = driver.session()
  try {
    const res = await session.run(
      `CREATE (n:${label} $props) RETURN n`,
      { props }
    )
    return res.records[0].get('n')
  } finally {
    await session.close()
  }
}

async function relateNodes(id1, id2, relType) {
  const session = driver.session()
  try {
    await session.run(
      `MATCH (a {id: $id1}), (b {id: $id2}) CREATE (a)-[r:${relType}]->(b) RETURN r`,
      { id1, id2 }
    )
  } finally {
    await session.close()
  }
}

module.exports = { addKnowledgeNode, relateNodes }