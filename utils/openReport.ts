import { spawn } from 'child_process';

export default async function openReport() {
  console.log('\nOpening Playwright HTML report...');
  const child = spawn('npx', ['playwright', 'show-report'], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}
