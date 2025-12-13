import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TIL_ROOT = path.join(PROJECT_ROOT, 'src', 'content', 'til');

// Regex to capture frontmatter
const FRONTMATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/;

function getDirectories(srcPath) {
  return fs.readdirSync(srcPath).filter(file => {
    return fs.statSync(path.join(srcPath, file)).isDirectory();
  });
}

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) return null;
  
  const frontmatter = match[1];
  const data = {};
  
  frontmatter.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Handle array format ["tag1", "tag2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
            // Replace single quotes with double quotes for JSON parsing if needed, 
            // but simple JSON.parse usually expects double quotes.
            // If tags are like ['a', 'b'], try to fix constraints.
            const validJson = value.replace(/'/g, '"');
            data[key] = JSON.parse(validJson);
        } catch (e) {
            // Fallback for simple list
             data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
      } else {
        data[key] = value;
      }
    }
  });
  
  return data;
}

function removeMetadataFromContent(content, keysToRemove) {
    return content.replace(FRONTMATTER_REGEX, (_, frontmatter) => {
        const lines = frontmatter.split('\n').filter(line => {
            const key = line.split(':')[0].trim();
            // Keep the line only if it's NOT in the keysToRemove list
            return !keysToRemove.includes(key);
        });
        // Reconstruct frontmatter
        return `---\n${lines.join('\n')}\n---`;
    });
}

async function normalize() {
    console.log('🧹 Normalizing TIL metadata...');
    const dirs = getDirectories(TIL_ROOT);
    
    for (const dir of dirs) {
        const dirPath = path.join(TIL_ROOT, dir);
        const metaPath = path.join(dirPath, 'meta.json');
        const esPath = path.join(dirPath, 'es.mdx');
        
        let metaData = {};
        let esData = {};
        
        // 1. Load or Initialize meta.json
        if (fs.existsSync(metaPath)) {
            try {
                metaData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            } catch (e) {
                console.error(`❌ Error parsing ${metaPath}:`, e.message);
                continue;
            }
        }
        
        // 2. Load ES content to extract missing data
        if (fs.existsSync(esPath)) {
            const esContent = fs.readFileSync(esPath, 'utf-8');
            esData = parseFrontmatter(esContent) || {};
        }

        // 3. Merge Strategy: meta.json wins, fallback to esData
        const finalPubDate = metaData.pubDate || esData.pubDate;
        const finalTags = metaData.tags || esData.tags;
        
        const updates = {};
        if (finalPubDate) updates.pubDate = finalPubDate;
        if (finalTags) updates.tags = finalTags;
        
        // Update meta.json object
        Object.assign(metaData, updates);
        
        // Write meta.json
        fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2));
        console.log(`✅ Updated/Verified meta.json for ${dir}`);
        
        // 4. Clean MDX files (ES, EN, CA)
        ['es.mdx', 'en.mdx', 'ca.mdx'].forEach(langFile => {
            const filePath = path.join(dirPath, langFile);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf-8');
                // Remove pubDate and tags lines
                const cleanContent = removeMetadataFromContent(content, ['pubDate', 'tags']);
                
                if (content !== cleanContent) {
                    fs.writeFileSync(filePath, cleanContent);
                    console.log(`   Refined ${langFile}`);
                }
            }
        });
    }
    console.log('✨ All done!');
}

normalize();
