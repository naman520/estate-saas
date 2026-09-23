/**
 * seed-test-domain.ts
 *
 * Adds a test custom domain record (ACTIVE status) to the first project found,
 * AND automatically adds the domain to the Windows hosts file.
 *
 * Usage:
 *   npx tsx scripts/seed-test-domain.ts [domain] [projectSlug]
 *
 * Examples:
 *   npx tsx scripts/seed-test-domain.ts plots.test
 *   npx tsx scripts/seed-test-domain.ts xyz.test my-project
 */

import { prisma } from "../lib/prisma";
import fs from "fs";
import os from "os";
import { execSync } from "child_process";

const HOSTS_FILE =
  process.platform === "win32"
    ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
    : "/etc/hosts";

/**
 * Checks if a domain entry already exists in the hosts file.
 */
function isInHostsFile(domain: string): boolean {
  try {
    const content = fs.readFileSync(HOSTS_FILE, "utf-8");
    return content
      .split(os.EOL)
      .some((line) => line.trim().endsWith(domain) && !line.startsWith("#"));
  } catch {
    return false;
  }
}

/**
 * Attempts to add 127.0.0.1 <domain> to the hosts file.
 * Returns true if successful, false if permission denied.
 */
function addToHostsFile(domain: string): boolean {
  const entry = `127.0.0.1    ${domain}`;

  if (isInHostsFile(domain)) {
    console.log(`✅ Hosts file: ${domain} already present.`);
    return true;
  }

  try {
    // On Windows, append via PowerShell (requires admin)
    if (process.platform === "win32") {
      execSync(
        `powershell -Command "Add-Content -Path '${HOSTS_FILE}' -Value '\r\n${entry}'"`,
        { stdio: "pipe" }
      );
    } else {
      fs.appendFileSync(HOSTS_FILE, `\n${entry}`);
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const domainArg = process.argv[2] ?? "test.local";
  const slugArg = process.argv[3];

  // Find project
  const project = slugArg
    ? await prisma.project.findUnique({ where: { slug: slugArg } })
    : await prisma.project.findFirst();

  if (!project) {
    console.error("❌ No project found. Please create a project first.");
    process.exit(1);
  }

  console.log(`✅ Found project: "${project.name}" (slug: ${project.slug})`);

  // Upsert the domain record in DB
  const record = await prisma.projectDomain.upsert({
    where: { domain: domainArg },
    update: { status: "ACTIVE", isPrimary: true, projectId: project.id },
    create: {
      domain: domainArg,
      type: "CUSTOM",
      status: "ACTIVE",
      isPrimary: true,
      projectId: project.id,
    },
  });

  console.log(`\n🎯 Domain seeded in DB:`);
  console.log(`   Domain  : ${record.domain}`);
  console.log(`   Status  : ${record.status}`);
  console.log(`   Project : ${project.name} (${project.slug})`);

  // Auto-add to hosts file
  console.log(`\n🖊️  Updating hosts file...`);
  const hostsOk = addToHostsFile(domainArg);

  if (hostsOk) {
    console.log(`✅ Hosts file updated: 127.0.0.1 → ${domainArg}`);
    console.log(`\n🚀 Ready! Open in browser:`);
    console.log(`   http://${domainArg}:3000\n`);
  } else {
    console.log(`\n⚠️  Could not write to hosts file (needs admin).`);
    console.log(`   Run this command in an Admin PowerShell to fix it:\n`);
    console.log(
      `   Add-Content -Path "${HOSTS_FILE}" -Value "127.0.0.1    ${domainArg}"\n`
    );
    console.log(`   Or bypass hosts entirely — visit directly:`);
    console.log(`   http://localhost:3000/domain-resolver?host=${domainArg}\n`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

