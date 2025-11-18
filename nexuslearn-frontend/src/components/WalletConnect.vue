<template>
  <el-button type="success" @click="connect" v-if="!store.address">连接钱包</el-button>
  <div v-else style="display:flex;gap:8px;align-items:center">
    <el-tag>{{ short }}</el-tag>
    <el-select v-model="chain" style="width:140px" @change="onSwitch">
      <el-option label="Sepolia" value="0xaa36a7" />
      <el-option label="Polygon Amoy" value="0x13882" />
    </el-select>
    <el-button size="small" @click="connectWC">WalletConnect</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWalletStore } from '../stores/wallet'
import { ElMessage } from 'element-plus'

const store = useWalletStore()
const short = computed(() => store.address ? `${store.address.slice(0,6)}...${store.address.slice(-4)}` : '')
const chain = ref('0xaa36a7')

async function connect() {
  try { await store.connect(); ElMessage.success('钱包已连接') } catch { ElMessage.error('连接失败') }
}

async function onSwitch(val: string) {
  try { await (await import('../lib/chain')).switchChain(val); ElMessage.success('网络已切换') } catch { ElMessage.error('切换失败') }
}

async function connectWC() {
  try {
    const pid = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string
    if (!pid) throw new Error('缺少 WalletConnect 项目ID')
    const { connectWithWalletConnect } = await import('../lib/walletconnect')
    const { address } = await connectWithWalletConnect(pid, [11155111])
    store.address = address
    ElMessage.success('WalletConnect 已连接')
  } catch { ElMessage.error('连接失败') }
}
</script>
