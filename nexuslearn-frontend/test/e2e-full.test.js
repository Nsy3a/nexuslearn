import { test, expect } from '@playwright/test'

test.describe('NexusLearn 完整交互', () => {
  test('链上闭环：需求→答案→验收→NFT', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // 1. 创建需求
    await page.getByRole('link', { name: /协作/i }).click()
    await page.getByLabel(/标题/i).fill('链上完整演示')
    await page.getByLabel(/预算/i).fill('100')
    await page.getByLabel(/技术栈/i).fill('Solidity,Hardhat')
    await page.getByRole('button', { name: /创建需求/i }).click()
    await expect(page.getByText('需求已创建')).toBeVisible()

    // 2. 提交答案
    await page.getByLabel(/答案URI/i).fill('ipfs://QmReal')
    await page.getByRole('button', { name: /提交答案/i }).click()
    await expect(page.getByText('答案已提交')).toBeVisible()

    // 3. 验收并铸造NFT
    await page.getByLabel(/内容哈希/i).fill('ipfs://QmFinalReal')
    await page.getByLabel(/摘要/i).fill('链上完整方案')
    await page.getByRole('button', { name: /验收/i }).click()
    await expect(page.getByText('已验收并铸造NFT')).toBeVisible()

    // 4. 验证NFT列表
    await page.getByRole('button', { name: /NFT/i }).click()
    await expect(page.getByRole('cell', { name: /ipfs:\/\/QmFinalReal/i })).toBeVisible()
  })

  test('学习闭环：目标→计划→评估→图表', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('link', { name: /学习/i }).click()
    await page.getByLabel(/用户ID/i).fill('e2e-chain')
    await page.getByLabel(/学习目标/i).fill('区块链入门')
    await page.getByLabel(/技能/i).fill('Solidity,DeFi,NFT')
    await page.getByRole('button', { name: /创建目标/i }).click()
    await expect(page.getByText('目标已创建')).toBeVisible()

    await page.getByRole('button', { name: /生成计划/i }).click()
    await expect(page.getByText('计划已生成')).toBeVisible()

    await page.getByLabel(/正确率/i).fill('0.9')
    await page.getByRole('button', { name: /提交评估/i }).click()
    await expect(page.getByText('评估完成')).toBeVisible()
    await expect(page.getByText('下一难度：高')).toBeVisible()
  })
})