import { execSync } from 'child_process';

const PORTS = [9323]; // Playwright HTML report port

export default async function killPort() {
  for (const port of PORTS) {
    try {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      console.log(`Killed process on port ${port}`);
    } catch {
      // No process running on this port — safe to ignore
    }
  }
}
