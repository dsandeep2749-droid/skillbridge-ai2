@echo off
cd /d c:\Users\dsand\OneDrive\Documents\skillbridgeai
git add -A
git commit -m "build: complete SkillBridge AI full-stack application"
git remote add ai2 https://github.com/dsandeep2749-droid/skillbridge-ai2.git
git push ai2 main

