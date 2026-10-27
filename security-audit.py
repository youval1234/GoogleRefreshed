"""Report secret/private-file candidates without printing candidate secret values."""
from pathlib import Path
from io import BytesIO
import subprocess, re, json, zipfile
from PIL import Image

ROOT=Path(__file__).parent
def git(*args):
    return subprocess.check_output(['git',*args],cwd=ROOT)
patterns={
    'GitHub token':rb'(?:gh[pousr]_[A-Za-z0-9_]{25,}|github_pat_[A-Za-z0-9_]{30,})',
    'Google API credential':rb'AIza[0-9A-Za-z_-]{30,}',
    'AWS access identifier':rb'(?:AKIA|ASIA)[A-Z0-9]{16}',
    'Private key':rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'Local user path':rb'(?:[A-Za-z]:[\\/]+Users[\\/]+|/home/)[A-Za-z0-9_.-]+',
    'Slack token':rb'xox[baprs]-[A-Za-z0-9-]{20,}',
    'Credential in URL':rb'https?://[^\s/<>"\x27:]+:[^\s/<>"\x27@]+@',
    'Assigned secret':rb'(?i)(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["\x27][A-Za-z0-9_+/=-]{16,}["\x27]',
}
findings=[]; scanned=0; pngs=0
def inspect(name,data,where):
    global scanned,pngs
    scanned+=1
    leaf=Path(name).name.lower()
    if leaf in ['cookies','login data','history','.env'] or leaf.endswith(('.pem','.pfx','.p12','.sqlite')) or '.test-profile' in name or '/node_modules/' in name:
        findings.append({'type':'Private/local file','path':name,'where':where})
    for label,pattern in patterns.items():
        if re.search(pattern,data):findings.append({'type':label,'path':name,'where':where})
    if name.endswith('.png'):
        pngs+=1
        im=Image.open(BytesIO(data))
        if im.getexif() or any(k.lower() in ['author','gps','comment','description'] for k in im.info):findings.append({'type':'Image metadata needs review','path':name,'where':where})

for path in git('ls-files','-z').decode().split('\0'):
    if path and (ROOT/path).is_file():inspect(path,(ROOT/path).read_bytes(),'current source')
commits=git('rev-list','--all').decode().splitlines()
for commit in commits:
    for path in git('ls-tree','-r','--name-only',commit).decode().splitlines():inspect(path,git('show',f'{commit}:{path}'),'Git history '+commit[:8])
archives=list((ROOT/'dist').glob('*.zip'))
for archive in archives:
    with zipfile.ZipFile(archive) as z:
        for name in z.namelist():inspect(name,z.read(name),'release '+archive.name)
report={'scannedFileVersions':scanned,'commitsReviewed':len(commits),'archivesReviewed':[x.name for x in archives],'imagesCheckedForMetadata':pngs,'findings':findings}
(ROOT/'audit-local.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
raise SystemExit(bool(findings))
