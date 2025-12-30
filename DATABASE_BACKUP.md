# CircuitIQ Database Backup Strategy

**Objective:** Implement automated database backups for the Neon PostgreSQL production database

---

## 🎯 Backup Strategy Overview

### What We're Protecting
- **User accounts** and authentication data
- **Wiring diagrams** metadata and AI analysis results
- **Diagnostic sessions** and conversation history
- **Component data** and test procedures
- **Subscription** and usage tracking

### Backup Frequency
- **Daily:** Automated full database backup
- **Weekly:** Downloadable backup for local storage
- **Pre-deployment:** Manual backup before major updates

---

## 🔧 Method 1: Neon Built-in Backups (Recommended)

### Neon Branch-Based Backups

Neon provides **point-in-time recovery** automatically on paid plans. Here's how to use it:

#### **Step 1: Verify Your Plan**
```bash
# Check your Neon plan at: https://console.neon.tech
# Free tier: 7-day history
# Pro tier: 30-day history  
# Enterprise: Custom retention
```

#### **Step 2: Enable Point-in-Time Recovery**
1. Go to **Neon Console** → Your Project
2. Navigate to **Settings** → **Backups**
3. Verify **Point-in-Time Recovery** is enabled (automatic on paid plans)

#### **Step 3: Create Manual Snapshots (Branches)**
```bash
# Install Neon CLI
npm install -g neonctl

# Authenticate
neonctl auth

# Create a backup branch
neonctl branches create --project-id your-project-id --name backup-$(date +%Y%m%d)
```

#### **Step 4: Automate with GitHub Actions**
Create `.github/workflows/backup.yml`:
```yaml
name: Daily Database Backup

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Create Neon Backup Branch
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
        run: |
          curl -X POST \
            https://console.neon.tech/api/v2/projects/${{ secrets.NEON_PROJECT_ID }}/branches \
            -H "Authorization: Bearer $NEON_API_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"branch\": {\"name\": \"backup-$(date +%Y%m%d)\"}}"
```

---

## 🔧 Method 2: pg_dump Manual Backups

### For Local Storage or Off-site Backups

#### **Step 1: Install PostgreSQL Client**
```bash
# macOS
brew install postgresql@16

# Verify installation
pg_dump --version
```

#### **Step 2: Get Neon Connection String**
```bash
# From Neon Console → Connection Details
# Format: postgresql://user:password@host/dbname?sslmode=require
```

#### **Step 3: Create Backup Script**
Create `/scripts/backup-db.sh`:
```bash
#!/bin/bash

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/CircuitIQ-Backups"
BACKUP_FILE="$BACKUP_DIR/circuitiq-$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database URL (stored in environment variable)
DATABASE_URL="${DATABASE_URL}"

echo "Starting backup at $(date)"

# Create backup with compression
pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_FILE.dump" \
  --verbose

# Also create SQL version for easy inspection
pg_dump "$DATABASE_URL" \
  --format=plain \
  --file="$BACKUP_FILE" \
  --verbose

# Compress SQL file
gzip "$BACKUP_FILE"

echo "Backup completed: $BACKUP_FILE.gz"
echo "Compressed backup: $BACKUP_FILE.dump"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Old backups cleaned up"
```

#### **Step 4: Make Script Executable**
```bash
chmod +x scripts/backup-db.sh
```

#### **Step 5: Test Backup**
```bash
# Load DATABASE_URL from .env
source .env

# Run backup
./scripts/backup-db.sh
```

#### **Step 6: Schedule with Cron (macOS/Linux)**
```bash
# Open crontab editor
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /Users/dradrigapatrick/Desktop/CircuitIQ && ./scripts/backup-db.sh >> logs/backup.log 2>&1
```

---

## 🔧 Method 3: Vercel Blob Storage Backups

### Automated Cloud Backups

#### **Step 1: Install Vercel Blob**
```bash
npm install @vercel/blob --save
```

#### **Step 2: Create Backup API Endpoint**
Create `/src/app/api/admin/backup/route.ts`:
```typescript
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Admin-only endpoint (add auth check)
export async function POST(req: Request) {
  // TODO: Add admin authentication check
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `backup-${timestamp}.sql`

  try {
    // Create database dump
    const { stdout } = await execAsync(
      `pg_dump "${process.env.DATABASE_URL}" --format=plain`
    )

    // Upload to Vercel Blob
    const blob = await put(filename, stdout, {
      access: 'public',
    })

    return NextResponse.json({
      success: true,
      filename,
      url: blob.url,
      size: blob.size,
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return NextResponse.json(
      { error: 'Backup failed' },
      { status: 500 }
    )
  }
}
```

#### **Step 3: Create Vercel Cron Job**
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

## 🔧 Method 4: Third-Party Backup Service

### Using Database Backup Tools

#### **Recommended Services:**

1. **SimpleBackups** (https://simplebackups.com)
   - Cost: $15/month
   - Features: Automated postgres backups, S3 storage
   - Setup: 5 minutes

2. **BackupNinja** (https://backupninja.app)
   - Cost: $9/month
   - Features: Neon-specific integration
   - Setup: Connect via API key

3. **Rewind** (https://rewind.io)
   - Cost: $7/month
   - Features: Continuous backups, 1-click restore
   - Setup: OAuth integration

---

## 📊 Backup Verification

### Test Backup Integrity

#### **Step 1: Verify Backup File**
```bash
# Check if backup is valid
pg_restore --list circuitiq-20241230.dump

# Should show list of tables and data
```

#### **Step 2: Test Restore (Local)**
```bash
# Create test database
createdb circuitiq_test

# Restore backup
pg_restore --dbname=circuitiq_test \
  --verbose \
  circuitiq-20241230.dump

# Verify data
psql circuitiq_test -c "SELECT COUNT(*) FROM \"User\";"
```

#### **Step 3: Automated Verification Script**
Create `/scripts/verify-backup.sh`:
```bash
#!/bin/bash

LATEST_BACKUP=$(ls -t ~/CircuitIQ-Backups/*.dump | head -1)

echo "Verifying backup: $LATEST_BACKUP"

# List contents
pg_restore --list "$LATEST_BACKUP" > /tmp/backup_contents.txt

# Check for critical tables
TABLES=("User" "Diagram" "Analysis" "Component")

for table in "${TABLES[@]}"; do
  if grep -q "TABLE $table" /tmp/backup_contents.txt; then
    echo "✓ Table $table found"
  else
    echo "✗ Table $table MISSING!"
    exit 1
  fi
done

echo "Backup verification passed!"
```

---

## 🚨 Disaster Recovery Plan

### Restoring from Backup

#### **Scenario 1: Restore Entire Database**
```bash
# 1. Create new Neon database (or use existing)
# Get connection string from Neon Console

# 2. Restore from backup
pg_restore --dbname="postgresql://user:pass@host/dbname" \
  --clean \
  --if-exists \
  --verbose \
  circuitiq-backup.dump

# 3. Run Prisma migration
npx prisma migrate deploy
```

#### **Scenario 2: Restore Specific Table**
```bash
# Restore only the "Diagram" table
pg_restore --dbname="your-connection-string" \
  --table="Diagram" \
  --clean \
  circuitiq-backup.dump
```

#### **Scenario 3: Point-in-Time Recovery (Neon)**
```bash
# 1. Go to Neon Console → Branches
# 2. Click "Restore to Point in Time"
# 3. Select date/time
# 4. Create new branch
# 5. Update DATABASE_URL to new branch
# 6. Verify data
# 7. Swap to main branch if correct
```

---

## 📋 Implementation Checklist

### Week 1: Setup Basic Backups
- [ ] Verify Neon plan supports point-in-time recovery
- [ ] Install `neonctl` CLI tool
- [ ] Create first manual backup branch
- [ ] Document connection strings securely

### Week 2: Automate Backups
- [ ] Create `backup-db.sh` script
- [ ] Test manual backup locally
- [ ] Set up cron job OR GitHub Action
- [ ] Verify backup runs successfully

### Week 3: Backup Verification
- [ ] Create `verify-backup.sh` script
- [ ] Test restore to local database
- [ ] Document restore procedure
- [ ] Set calendar reminder to test quarterly

### Ongoing: Maintenance
- [ ] Monitor backup storage usage
- [ ] Test restore every 3 months
- [ ] Review backup retention policy
- [ ] Update disaster recovery docs

---

## 💰 Cost Comparison

| Method | Setup Time | Monthly Cost | Retention | Difficulty |
|--------|-----------|--------------|-----------|------------|
| **Neon Branches** | 10 min | $0 (included) | 7-30 days | Easy |
| **pg_dump + Local** | 20 min | $0 | Unlimited | Medium |
| **Vercel Blob** | 30 min | $5-20 | Custom | Medium |
| **SimpleBackups** | 5 min | $15 | Unlimited | Very Easy |

---

## 🎯 Recommended Setup

**For Your Current Stage:**

1. **Enable Neon point-in-time recovery** (already included in Pro plan)
2. **Set up weekly manual backups** using `pg_dump` script
3. **Store backups locally** + optional cloud backup (Google Drive, Dropbox)
4. **Test restore procedure** once after setup

**Total Cost:** $0/month  
**Setup Time:** 30 minutes  
**Maintenance:** 5 minutes/month

---

## 📞 Support Resources

- **Neon Backups Docs:** https://neon.tech/docs/manage/backups
- **PostgreSQL Backup Guide:** https://www.postgresql.org/docs/current/backup.html
- **Prisma Migrations:** https://www.prisma.io/docs/concepts/components/prisma-migrate

---

**Next Step:** Choose a backup method and implement Week 1 of the checklist above.
