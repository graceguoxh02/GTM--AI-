#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Claude 对话历史自动备份守护进程
在后台运行，定期自动保存对话历史
"""

import time
import subprocess
from pathlib import Path
from datetime import datetime
import sys

class AutoBackup:
    def __init__(self, interval_minutes=30):
        self.interval = interval_minutes * 60  # 转换为秒
        self.script_path = Path(__file__).parent / "claude-history-manager.py"
        self.log_file = Path.home() / ".claude" / "auto-backup.log"

    def log(self, message):
        """记录日志"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}\n"

        print(log_message.strip())

        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(log_message)
        except:
            pass

    def backup(self):
        """执行备份"""
        try:
            self.log("Starting backup...")
            result = subprocess.run(
                [sys.executable, str(self.script_path)],
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0:
                self.log("Backup completed successfully!")
            else:
                self.log(f"Backup failed: {result.stderr}")

        except Exception as e:
            self.log(f"Error during backup: {e}")

    def run(self):
        """运行守护进程"""
        self.log(f"Auto-backup daemon started (interval: {self.interval // 60} minutes)")

        # 立即执行一次备份
        self.backup()

        try:
            while True:
                time.sleep(self.interval)
                self.backup()
        except KeyboardInterrupt:
            self.log("Auto-backup daemon stopped")

def main():
    if len(sys.argv) > 1:
        try:
            interval = int(sys.argv[1])
        except ValueError:
            interval = 30
    else:
        interval = 30

    print(f"Starting auto-backup daemon...")
    print(f"Backup interval: {interval} minutes")
    print(f"Press Ctrl+C to stop\n")

    daemon = AutoBackup(interval_minutes=interval)
    daemon.run()

if __name__ == "__main__":
    main()
