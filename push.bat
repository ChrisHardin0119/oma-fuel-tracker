@echo off
cd /d "C:\Users\Chris\CLAUDE OVERWORLD\oma-fuel-tracker"
echo === Adding safe directory === > gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" config --global --add safe.directory "C:/Users/Chris/CLAUDE OVERWORLD/oma-fuel-tracker" >> gitlog.txt 2>&1
echo === Git Config === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" config user.email "chrishardin.als@gmail.com" >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" config user.name "Chris" >> gitlog.txt 2>&1
echo === Git Add === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" add -A >> gitlog.txt 2>&1
echo === Git Status === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" status >> gitlog.txt 2>&1
echo === Git Commit === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit: OMA Fuel Tracker PWA" >> gitlog.txt 2>&1
echo === Adding Remote === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/ChrisHardin0119/oma-fuel-tracker.git >> gitlog.txt 2>&1
echo === Branch Main === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" branch -M main >> gitlog.txt 2>&1
echo === Push === >> gitlog.txt 2>&1
"C:\Program Files\Git\cmd\git.exe" push -u origin main >> gitlog.txt 2>&1
echo === Done === >> gitlog.txt 2>&1
