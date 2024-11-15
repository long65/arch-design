import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';

export default [
  {
    // 适用于所有 ts、tsx 和 vue 文件
    name: 'app/files-to-lint',
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      // Vue 规则
      'vue/multi-word-component-names': 'off', // 允许单词组件名
      'vue/require-default-prop': 'off', // 不强制要求默认 props 值
      'vue/no-v-html': 'warn', // 使用 v-html 时警告，避免 XSS 问题
      'vue/html-indent': ['warn', 2], // 设置HTML中的缩进为2个空格
      'vue/max-attributes-per-line': ['warn', { singleline: 3, multiline: 1 }], // 每行最多3个属性

      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 忽略下划线开头的未使用参数
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 不强制模块边界类型

      // 代码风格
      'quotes': ['warn', 'single', { avoidEscape: true }], // 鼓励使用单引号
      'semi': ['warn', 'always'], // 建议使用分号结尾
      'comma-dangle': ['warn', 'only-multiline'], // 鼓励多行结构尾部带逗号
      'indent': ['warn', 2], // 使用2个空格的缩进
      'object-curly-spacing': ['warn', 'always'], // 对象字面量使用大括号空格

      // 常见开发友好设置
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中对 console 提示警告
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 生产环境中对 debugger 提示警告
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 忽略未使用的函数参数以减少警告
    },
  },
  {
    // 忽略文件夹
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },

  // Vue 和 TypeScript 插件
  pluginVue, // 手动引入 Vue 插件，不使用预设配置
  vueTsEslintConfig(), // TypeScript 配置
];
