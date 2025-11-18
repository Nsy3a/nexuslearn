<template>
  <div>
    <el-card>
      <template #header>数据总览</template>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-statistic title="用户数" :value="stats.users" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="资料数" :value="stats.materials" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="需求数" :value="stats.demands" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="NFT数" :value="stats.nfts" />
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top:16px">
      <template #header>链上事件流</template>
      <el-table :data="events" style="width:100%">
        <el-table-column prop="event" label="事件" width="120" />
        <el-table-column prop="demandId" label="需求ID" />
        <el-table-column prop="tokenId" label="TokenID" />
        <el-table-column prop="ts" label="时间">
          <template #default="scope">{{ new Date(scope.row.ts).toLocaleString() }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { safeFetchJson } from '../utils/http'

const stats = ref({ users: 1, materials: 0, demands: 0, nfts: 0 })
const events = ref<any[]>([])

async function load() {
  // 简单统计：读取本地JSON
  const res = await safeFetchJson('/api/materials', undefined, { items: [] })
  stats.value.materials = res.items?.length || 0
  const dres = await safeFetchJson('/api/demands', undefined, { items: [] })
  stats.value.demands = dres.items?.length || 0
  const nres = await safeFetchJson('/api/nfts', undefined, { items: [] })
  stats.value.nfts = nres.items?.length || 0
  const eres = await safeFetchJson('/api/events', undefined, { items: [] })
  events.value = eres.items || []
}

onMounted(load)
</script>