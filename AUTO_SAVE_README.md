# Claude 对话历史自动保存系统

## 📁 文件说明

### 主程序
- `claude-history-manager.py` - 全局对话历史管理器
  - 扫描所有 Claude 项目
  - 生成人类可读的 Markdown 文件
  - 创建美观的 Web 查看器

### 快捷脚本
1. **`view-all-history.bat`** - 更新并查看所有对话历史
   - 双击运行，自动生成最新历史
   - 自动打开浏览器查看

2. **`open-history.bat`** - 快速打开历史查看器
   - 不更新数据，直接打开已有的历史页面

## 🚀 使用方法

### 方法 1：手动导出（推荐）

**在 VSCode 终端中运行：**
```bash
python claude-history-manager.py
```

**或者双击：**
```
view-all-history.bat
```

### 方法 2：快速查看历史

双击 `open-history.bat`，立即打开历史查看器。

### 方法 3：添加到 VSCode 任务

在 VSCode 中按 `Ctrl+Shift+P`（或 F1），输入 "Tasks: Configure Task"，添加：

```json
{
  "label": "Export Claude History",
  "type": "shell",
  "command": "python claude-history-manager.py",
  "problemMatcher": [],
  "group": {
    "kind": "build",
    "isDefault": false
  }
}
```

然后按 `Ctrl+Shift+B` 即可快速导出历史。

## 📂 输出位置

所有对话历史保存在：
```
C:\Users\你的用户名\Documents\Claude History\
```

包含：
- `index.html` - 主页面（在浏览器中打开）
- `[项目名].md` - 各项目的对话历史

## 🔄 自动化选项

### 选项 A：创建定时任务（Windows）

1. 打开"任务计划程序"
2. 创建基本任务
3. 触发器：每天或每周
4. 操作：运行 `view-all-history.bat`

### 选项 B：关机时自动保存

创建一个关机脚本：
```batch
@echo off
python "路径\claude-history-manager.py"
shutdown /s /t 60
```

### 选项 C：VSCode 扩展钩子

在 VSCode 设置中添加：
```json
{
  "claude.hooks.onExit": "python claude-history-manager.py"
}
```

## 💡 最佳实践

### 推荐工作流：

1. **日常使用**：正常与 Claude 对话
2. **完成任务后**：运行 `view-all-history.bat`
3. **查看历史**：随时双击 `open-history.bat`
4. **搜索对话**：在 index.html 中使用搜索框

### 备份建议：

定期备份 `C:\Users\你的用户名\Documents\Claude History\` 文件夹到云盘或其他位置。

## 🎨 功能特性

### 索引页面特性：
- ✅ 美观的卡片式设计
- ✅ 实时搜索功能
- ✅ 显示对话数量和时间
- ✅ 按项目分类
- ✅ 响应式设计

### Markdown 文件特性：
- ✅ 清晰的对话格式
- ✅ 时间戳记录
- ✅ 用户/AI 消息区分
- ✅ 支持 VSCode 预览

## 🔧 自定义

### 修改输出目录

编辑 `claude-history-manager.py` 的第 14 行：
```python
self.output_dir = Path.home() / "Documents" / "Claude History"
```

改为您想要的路径。

### 修改样式

编辑生成的 `index.html`，修改 `<style>` 部分的 CSS。

## ❓ 常见问题

### Q: 为什么有些项目的对话很少？
A: 可能是短期测试项目或错误日志，正常现象。

### Q: 可以删除某些项目的历史吗？
A: 可以，直接删除 `Claude History` 文件夹中对应的 `.md` 文件，然后重新运行脚本更新索引。

### Q: 历史文件占用空间大吗？
A: 纯文本格式，通常很小。几百个对话大约几 MB。

## 📝 更新日志

- v1.0 - 初始版本
  - 全局项目扫描
  - HTML 查看器
  - Markdown 导出

---

**Happy Chatting with Claude! 🤖**
