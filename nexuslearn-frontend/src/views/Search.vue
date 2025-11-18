<template>
  <div>
    <el-card>
      <template #header>知识仓库</template>
      <el-form inline>
        <el-form-item label="URL">
          <el-input v-model="url" placeholder="https://example.com/doc" style="width:280px" />
        </el-form-item>
        <el-form-item label="密度">
          <el-select v-model="density" style="width:100px">
            <el-option label="入门" value="入门" />
            <el-option label="进阶" value="进阶" />
            <el-option label="专家" value="专家" />
          </el-select>
        </el-form-item>
        <el-form-item label="学科">
          <el-input v-model="subject" placeholder="会计" />
        </el-form-item>
        <el-form-item label="形态">
          <el-select v-model="form" style="width:100px">
            <el-option label="理论" value="理论" />
            <el-option label="实战" value="实战" />
            <el-option label="案例" value="案例" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onIngestUrl">录入URL</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-upload
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept=".txt,.md,.pdf"
      >
        <el-button>上传文件</el-button>
      </el-upload>
      <el-button @click="onListMaterials" style="margin-left:8px">列出资料</el-button>
    </el-card>

    <el-card style="margin-top:16px">
      <template #header>{{ $t('search.search') }}</template>
      <el-form inline>
        <el-form-item :label="$t('search.keyword')">
          <el-input v-model="keyword" placeholder="机器学习" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">{{ $t('search.search') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="store.results" style="width:100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="url" label="URL" />
        <el-table-column prop="rank" label="Rank" width="90" />
        <el-table-column prop="recommend" label="推荐语" />
      </el-table>
    </el-card>

    <el-card style="margin-top:16px" v-if="store.materials.length">
      <template #header>资料列表</template>
      <el-table :data="store.materials" style="width:100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="url" label="URL" />
        <el-table-column prop="filename" label="文件名" />
        <el-table-column prop="tags.subject" label="学科" />
        <el-table-column prop="tags.form" label="形态" />
        <el-table-column prop="qualityScore" label="质量分" width="90" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from '../stores/search'
import { ElMessage } from 'element-plus'

const store = useSearchStore()
const url = ref('https://example.com/doc')
const density = ref('进阶')
const subject = ref('会计')
const form = ref('理论')
const keyword = ref('机器学习')

async function onIngestUrl() {
  try {
    await store.ingestUrl(url.value, { density: density.value, subject: subject.value, form: form.value })
    ElMessage.success('已录入')
    await store.listMaterials()
  } catch (e) { ElMessage.error('失败') }
}

async function onListMaterials() {
  try { await store.listMaterials() } catch (e) { ElMessage.error('失败') }
}

async function onSearch() {
  try { await store.search(keyword.value, 'u1', { subject: subject.value }) } catch (e) { ElMessage.error('失败') }
}

function beforeUpload(file: File) {
  const reader = new FileReader()
  reader.onload = async () => {
    const base64 = (reader.result as string).split(',')[1]
    try {
      await store.uploadFile(file.name, base64 || '', { density: density.value, subject: subject.value || '', form: form.value || '' })
      ElMessage.success('已上传')
      await store.listMaterials()
    } catch (e) { ElMessage.error('失败') }
  }
  reader.readAsDataURL(file)
  return false
}
</script>