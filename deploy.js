import { execSync } from 'child_process';
import { cpSync, rmSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMP_DIR = 'C:\\tmp\\deploy';
const DIST_DIR = join(__dirname, 'dist');
const REPO_URL = 'https://github.com/Mahdiy005/MyPortfolio.git';
const BRANCH = 'gh-pages';

try {
    // Clean up temp directory
    if (existsSync(TEMP_DIR)) {
        rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    mkdirSync(TEMP_DIR, { recursive: true });

    console.log('Cloning gh-pages branch...');
    let branchExists = true;
    try {
        execSync(`git clone --depth 1 --branch ${BRANCH} ${REPO_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });
    } catch {
        branchExists = false;
        console.log('gh-pages branch does not exist, creating new one...');
        execSync(`git clone --depth 1 ${REPO_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });
    }

    // Remove old files (except .git)
    console.log('Cleaning old files...');
    const files = readdirSync(TEMP_DIR);
    for (const file of files) {
        if (file !== '.git') {
            rmSync(join(TEMP_DIR, file), { recursive: true, force: true });
        }
    }

    // Copy new dist files
    console.log('Copying dist files...');
    cpSync(DIST_DIR, TEMP_DIR, { recursive: true });

    // Commit and push
    console.log('Committing and pushing...');

    const opts = { cwd: TEMP_DIR, stdio: 'inherit' };

    if (!branchExists) {
        execSync('git checkout --orphan gh-pages', opts);
    }

    execSync('git add -A', opts);

    try {
        execSync('git commit -m "Deploy to GitHub Pages"', opts);
    } catch {
        console.log('No changes to commit');
    }

    execSync(`git push origin ${BRANCH} --force`, opts);

    console.log('\\nPublished successfully!');
    console.log('Your site should be available at: https://mahdiy005.github.io/MyPortfolio/');
} catch (error) {
    console.error('Deploy failed:', error.message);
    process.exit(1);
}


