#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Claude 对话历史管理器
自动扫描并管理所有 Claude Code 对话历史
"""

import json
import sys
from pathlib import Path
from datetime import datetime
import shutil

class ClaudeHistoryManager:
    def __init__(self):
        self.claude_dir = Path.home() / ".claude"
        self.projects_dir = self.claude_dir / "projects"
        self.output_dir = Path.home() / "Documents" / "Claude History"
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def get_all_projects(self):
        """获取所有项目"""
        if not self.projects_dir.exists():
            return []

        projects = []
        for project_dir in self.projects_dir.iterdir():
            if project_dir.is_dir():
                # 查找 JSONL 文件
                jsonl_files = list(project_dir.glob("*.jsonl"))
                if jsonl_files:
                    projects.append({
                        'name': project_dir.name,
                        'path': project_dir,
                        'conversations': jsonl_files
                    })
        return projects

    def parse_conversation(self, jsonl_path):
        """解析单个对话历史"""
        conversations = []

        try:
            with open(jsonl_path, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        if data.get('type') == 'user':
                            message = data.get('message', {})
                            content_list = message.get('content', [])
                            text = ''
                            for item in content_list:
                                if item.get('type') == 'text':
                                    text = item.get('text', '')

                            if text:
                                conversations.append({
                                    'role': 'user',
                                    'content': text,
                                    'timestamp': data.get('timestamp', '')
                                })

                        elif data.get('type') == 'assistant':
                            message = data.get('message', {})
                            content_list = message.get('content', [])
                            text = ''
                            for item in content_list:
                                if item.get('type') == 'text':
                                    text = item.get('text', '')

                            if text:
                                conversations.append({
                                    'role': 'assistant',
                                    'content': text,
                                    'timestamp': data.get('timestamp', '')
                                })
                    except json.JSONDecodeError:
                        continue
        except Exception as e:
            print(f"Error parsing {jsonl_path}: {e}")

        return conversations

    def format_timestamp(self, iso_timestamp):
        """格式化时间戳"""
        try:
            dt = datetime.fromisoformat(iso_timestamp.replace('Z', '+00:00'))
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except:
            return iso_timestamp

    def get_conversation_summary(self, conversations):
        """获取对话摘要"""
        if not conversations:
            return "Empty conversation"

        # 获取第一条用户消息作为摘要
        for conv in conversations:
            if conv['role'] == 'user' and conv['content']:
                summary = conv['content'][:100]
                if len(conv['content']) > 100:
                    summary += "..."
                return summary

        return "No content"

    def generate_project_markdown(self, project, conversations):
        """为单个项目生成 Markdown"""
        md = f"# {project['name']}\n\n"
        md += f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        md += f"对话数量: {len(conversations)} 条\n\n"
        md += "---\n\n"

        for i, conv in enumerate(conversations, 1):
            if not conv['content']:
                continue

            role = "👤 用户" if conv['role'] == 'user' else "🤖 Claude"
            timestamp = self.format_timestamp(conv['timestamp']) if conv['timestamp'] else ''

            md += f"## {i}. {role}\n\n"
            if timestamp:
                md += f"*{timestamp}*\n\n"
            md += f"{conv['content']}\n\n"
            md += "---\n\n"

        return md

    def generate_index_html(self, projects_info):
        """生成索引 HTML"""
        html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude 对话历史</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .stats {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-bottom: 40px;
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            padding: 20px 40px;
            border-radius: 15px;
            color: white;
            text-align: center;
        }
        .stat-card h3 {
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            opacity: 0.9;
        }
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        .project-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }
        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        .project-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .project-icon {
            font-size: 2em;
            margin-right: 15px;
        }
        .project-title {
            flex: 1;
        }
        .project-title h3 {
            font-size: 1.3em;
            color: #333;
            margin-bottom: 5px;
            word-break: break-word;
        }
        .project-date {
            font-size: 0.9em;
            color: #666;
        }
        .project-summary {
            color: #555;
            line-height: 1.6;
            margin-bottom: 15px;
            font-size: 0.95em;
        }
        .project-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .conversation-count {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #667eea;
            font-weight: 600;
        }
        .view-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9em;
            transition: opacity 0.3s;
        }
        .view-button:hover {
            opacity: 0.9;
        }
        .search-box {
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        .search-box input {
            width: 100%;
            padding: 12px;
            border: 2px solid #eee;
            border-radius: 8px;
            font-size: 1em;
            outline: none;
            transition: border-color 0.3s;
        }
        .search-box input:focus {
            border-color: #667eea;
        }
        .empty-state {
            text-align: center;
            color: white;
            padding: 60px 20px;
        }
        .empty-state h2 {
            font-size: 2em;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🤖 Claude 对话历史</h1>
            <p>所有与 Claude 的对话记录</p>
        </header>

        <div class="stats">
            <div class="stat-card">
                <h3>__TOTAL_PROJECTS__</h3>
                <p>项目数</p>
            </div>
            <div class="stat-card">
                <h3>__TOTAL_CONVERSATIONS__</h3>
                <p>对话总数</p>
            </div>
        </div>

        <div class="search-box">
            <input type="text" id="searchInput" placeholder="🔍 搜索项目或对话内容...">
        </div>

        <div class="projects-grid" id="projectsGrid">
            __PROJECTS_HTML__
        </div>
    </div>

    <script>
        // 搜索功能
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.project-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    </script>
</body>
</html>"""

        # 生成项目卡片
        projects_html = ""
        total_conversations = 0

        for info in projects_info:
            total_conversations += info['count']

            projects_html += f"""
            <div class="project-card">
                <div class="project-header">
                    <div class="project-icon">📁</div>
                    <div class="project-title">
                        <h3>{info['display_name']}</h3>
                        <div class="project-date">{info['last_updated']}</div>
                    </div>
                </div>
                <div class="project-summary">
                    {info['summary']}
                </div>
                <div class="project-footer">
                    <div class="conversation-count">
                        💬 {info['count']} 条对话
                    </div>
                    <a href="{info['filename']}" class="view-button">查看详情</a>
                </div>
            </div>
            """

        if not projects_html:
            projects_html = """
            <div class="empty-state">
                <h2>暂无对话历史</h2>
                <p>开始使用 Claude Code 后，对话历史将自动保存在这里</p>
            </div>
            """

        html = html.replace('__TOTAL_PROJECTS__', str(len(projects_info)))
        html = html.replace('__TOTAL_CONVERSATIONS__', str(total_conversations))
        html = html.replace('__PROJECTS_HTML__', projects_html)

        return html

    def clean_project_name(self, name):
        """清理项目名称"""
        # 将路径分隔符替换为更友好的格式
        name = name.replace('-----', ' / ')
        name = name.replace('---', ' - ')
        name = name.replace('--', ' ')
        return name

    def export_all(self):
        """导出所有对话历史"""
        print("Scanning Claude projects...")
        projects = self.get_all_projects()

        if not projects:
            print("No projects found!")
            return

        print(f"Found {len(projects)} projects")

        projects_info = []

        for project in projects:
            print(f"\nProcessing: {project['name']}")

            # 处理每个对话文件
            for jsonl_file in project['conversations']:
                conversations = self.parse_conversation(jsonl_file)

                if not conversations:
                    continue

                print(f"  - {len(conversations)} messages in {jsonl_file.name}")

                # 生成 Markdown
                md_content = self.generate_project_markdown(project, conversations)

                # 保存 Markdown
                safe_name = project['name'].replace('/', '_').replace('\\', '_')
                md_filename = f"{safe_name}.md"
                md_path = self.output_dir / md_filename

                with open(md_path, 'w', encoding='utf-8') as f:
                    f.write(md_content)

                # 获取最后更新时间
                last_conv = conversations[-1] if conversations else None
                last_time = "Unknown"
                if last_conv and last_conv['timestamp']:
                    last_time = self.format_timestamp(last_conv['timestamp'])

                # 添加到索引
                projects_info.append({
                    'name': project['name'],
                    'display_name': self.clean_project_name(project['name']),
                    'filename': md_filename,
                    'count': len(conversations),
                    'summary': self.get_conversation_summary(conversations),
                    'last_updated': last_time
                })

        # 生成索引 HTML
        print("\nGenerating index...")
        index_html = self.generate_index_html(projects_info)
        index_path = self.output_dir / "index.html"

        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(index_html)

        print(f"\n{'='*60}")
        print(f"Export completed!")
        print(f"Total projects: {len(projects_info)}")
        print(f"Output directory: {self.output_dir}")
        print(f"\nOpen this file to view all conversations:")
        print(f"  {index_path}")
        print(f"{'='*60}\n")

        return index_path

def main():
    manager = ClaudeHistoryManager()
    index_path = manager.export_all()

    # 自动打开浏览器
    if index_path:
        import webbrowser
        webbrowser.open(f'file:///{index_path}')

if __name__ == "__main__":
    main()
