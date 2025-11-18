<template>
  <el-container>
    <el-header>
      <el-menu mode="horizontal" :default-active="$route.path" router>
        <el-menu-item index="/">{{ $t('nav.home') }}</el-menu-item>
        <el-menu-item index="/dashboard">{{ $t('nav.dashboard') }}</el-menu-item>
        <el-menu-item index="/learning">{{ $t('nav.learning') }}</el-menu-item>
        <el-sub-menu index="search">
          <template #title>{{ $t('nav.search') }}</template>
          <el-menu-item index="/search">基础搜索</el-menu-item>
          <el-menu-item index="/advanced-search">{{ $t('nav.advanced-search') }}</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="knowledge">
          <template #title>知识仓库</template>
          <el-menu-item index="/materials">📚 资料管理</el-menu-item>
          <el-menu-item index="/code-warehouse">{{ $t('nav.code-warehouse') }}</el-menu-item>
          <el-menu-item index="/context-engine">{{ $t('nav.context-engine') }}</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/collaboration">{{ $t('nav.collaboration') }}</el-menu-item>
        <el-menu-item index="/community">{{ $t('nav.community') }}</el-menu-item>
        <el-menu-item index="/nft-marketplace">{{ $t('nav.nft-marketplace') }}</el-menu-item>
        <el-menu-item index="/governance">{{ $t('nav.governance') }}</el-menu-item>
        <el-menu-item index="/progress">{{ $t('nav.progress') }}</el-menu-item>
        <div style="margin-left:auto; padding: 0 12px">
          <WalletConnect />
        </div>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer style="text-align:center;font-size:12px;color:#999">
      NexusLearn MVP © 2025
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import WalletConnect from './components/WalletConnect.vue'
</script>

<style scoped>
.el-header { padding: 0; }
@media (max-width: 600px) {
  .el-menu--horizontal .el-menu-item { padding: 0 10px; }
}
</style>

<style>
:root {
  --app-bg: radial-gradient(1000px 600px at 20% -10%, rgba(255,255,255,0.35), transparent),
             radial-gradient(800px 500px at 100% 10%, rgba(255,255,255,0.25), transparent),
             linear-gradient(120deg, #eef2f7 0%, #f7f9fc 100%);
  --card-bg: rgba(255, 255, 255, 0.6);
  --card-bg-strong: rgba(255, 255, 255, 0.72);
  --glass-blur: saturate(1.2) blur(20px);
  --border-color: rgba(255, 255, 255, 0.35);
  --shadow-soft: 0 12px 30px rgba(31, 43, 58, 0.08);
  --primary: #409EFF;
  --accent-green: #67C23A;
  --accent-orange: #E6A23C;
  --accent-red: #F56C6C;
  --text-dark: #2c3e50;
  --text-muted: #606266;
  --text-primary: #1a1a1a;
  --text-secondary: #4a5568;
  --text-tertiary: #718096;
  --glass-text: #2d3748;
  --glass-text-light: #4a5568;
}
</style>
