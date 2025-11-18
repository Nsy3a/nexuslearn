<template>
  <div>
    <el-card>
      <template #header>治理</template>
      <el-form inline>
        <el-form-item label="提案描述">
          <el-input v-model="desc" placeholder="提案内容" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPropose">提交提案</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top:16px">
      <template #header>提案列表</template>
      <el-table :data="store.proposals" style="width:100%">
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="投票" width="220">
          <template #default="scope">
            <el-button size="small" @click="onVote(scope.row.id, 1)">赞成</el-button>
            <el-button size="small" @click="onVote(scope.row.id, 0)">反对</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGovernanceStore } from '../stores/governance'
import { ElMessage } from 'element-plus'

const store = useGovernanceStore()
const desc = ref('示例提案：提高资料质量评分权重')

async function onPropose() {
  try {
    await store.propose(desc.value)
    ElMessage.success('提案已提交')
    await store.fetchProposals()
  } catch { ElMessage.error('失败') }
}

async function onVote(id: string, support: number) {
  try {
    await store.vote(id, support)
    ElMessage.success('已投票')
  } catch { ElMessage.error('失败') }
}

onMounted(() => store.fetchProposals())
</script>

