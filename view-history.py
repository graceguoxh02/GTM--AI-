#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Claude 对话历史查看器
将 JSONL 格式的对话历史转换为易读的 Markdown 格式
"""

import json
import sys
from pathlib import Path
from datetime import datetime

def parse_chat_history(jsonl_path):
    """解析 JSONL 对话历史"""
    conversations = []

    with open(jsonl_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'user':
                    # 用户消息
                    message = data.get('message', {})
                    content_list = message.get('content', [])
                    text = ''
                    for item in content_list:
                        if item.get('type') == 'text':
                            text = item.get('text', '')

                    timestamp = data.get('timestamp', '')
                    conversations.append({
                        'role': 'user',
                        'content': text,
                        'timestamp': timestamp
                    })

                elif data.get('type') == 'assistant':
                    # AI 回复
                    message = data.get('message', {})
                    content_list = message.get('content', [])
                    text = ''
                    for item in content_list:
                        if item.get('type') == 'text':
                            text = item.get('text', '')

                    timestamp = data.get('timestamp', '')
                    conversations.append({
                        'role': 'assistant',
                        'content': text,
                        'timestamp': timestamp
                    })
            except json.JSONDecodeError:
                continue

    return conversations

def format_timestamp(iso_timestamp):
    """格式化时间戳"""
    try:
        dt = datetime.fromisoformat(iso_timestamp.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return iso_timestamp

def generate_markdown(conversations):
    """生成 Markdown 格式的对话历史"""
    md = "# Claude 对话历史\n\n"
    md += f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    md += "---\n\n"

    for i, conv in enumerate(conversations, 1):
        if not conv['content']:
            continue

        role = "👤 用户" if conv['role'] == 'user' else "🤖 Claude"
        timestamp = format_timestamp(conv['timestamp']) if conv['timestamp'] else ''

        md += f"## {i}. {role}\n\n"
        if timestamp:
            md += f"*时间: {timestamp}*\n\n"
        md += f"{conv['content']}\n\n"
        md += "---\n\n"

    return md

def main():
    # 默认路径
    default_path = Path.home() / ".claude" / "projects" / "e-----vibe-coding-Claude-Code-gtm-assistant-ai-version" / "24a291d5-5997-4fbf-855b-da4a8cac7cea.jsonl"

    # 使用命令行参数或默认路径
    jsonl_path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_path

    if not jsonl_path.exists():
        print(f"File not found: {jsonl_path}")
        return

    print(f"Reading chat history: {jsonl_path.name}")

    # 解析对话
    conversations = parse_chat_history(jsonl_path)
    print(f"Found {len(conversations)} messages")

    # 生成 Markdown
    markdown = generate_markdown(conversations)

    # 保存到文件
    output_path = jsonl_path.parent / "chat_history.md"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(markdown)

    print(f"Chat history saved to: {output_path}")
    print(f"\nView with:")
    print(f"  code \"{output_path}\"")

if __name__ == "__main__":
    main()
