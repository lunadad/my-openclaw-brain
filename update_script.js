const fs = require('fs');
let code = fs.readFileSync('/Users/haluna/.openclaw/workspace/script.js', 'utf8');

const regex = /\/\/ ── OpenClaw Art Briefing Render ────────────────────────────────────────────\nfunction renderArtBriefing\(items = artBriefingItems\) \{[\s\S]*?\}\n/g;
const newCode = fs.readFileSync('patch_script.js', 'utf8');

code = code.replace(regex, newCode + '\n');
fs.writeFileSync('/Users/haluna/.openclaw/workspace/script.js', code);
