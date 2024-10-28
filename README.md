# Audio Client

### Requirements
* MPV

### Getting Started
Create virtual env:
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip3 install -r requirements.txt
```

Run the main.py:
```bash
python3 main.py
```

Build executable zipapp (requires shiv - `pip3 install shiv`):
```bash
shiv --output-file audio-client.pyz --entry-point main:main --compressed -r requirements.txt .
```
