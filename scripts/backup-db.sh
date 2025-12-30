#!/bin/bash

###############################################################################
# CircuitIQ Database Backup Script
# 
# This script creates automated backups of the Neon PostgreSQL database
# and stores them locally with automatic cleanup of old backups.
#
# Usage: ./scripts/backup-db.sh
# Cron: 0 2 * * * cd /path/to/CircuitIQ && ./scripts/backup-db.sh
###############################################################################

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/CircuitIQ-Backups"
BACKUP_FILE="$BACKUP_DIR/circuitiq-$TIMESTAMP"
LOG_FILE="$BACKUP_DIR/backup.log"

# Retention policy (days)
RETENTION_DAYS=30

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to log errors
error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to log success
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log "========================================="
log "Starting CircuitIQ Database Backup"
log "========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL environment variable is not set"
    error "Please set it in your .env file or export it before running this script"
    exit 1
fi

log "Database URL found"

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    error "pg_dump is not installed"
    error "Please install PostgreSQL client tools:"
    error "  macOS: brew install postgresql@16"
    error "  Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

log "pg_dump found: $(pg_dump --version)"

# Create compressed binary backup (.dump)
log "Creating compressed backup..."
pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_FILE.dump" \
  --verbose 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    DUMP_SIZE=$(du -h "$BACKUP_FILE.dump" | cut -f1)
    success "Compressed backup created: $BACKUP_FILE.dump ($DUMP_SIZE)"
else
    error "Failed to create compressed backup"
    exit 1
fi

# Create plain SQL backup for easy inspection
log "Creating SQL backup..."
pg_dump "$DATABASE_URL" \
  --format=plain \
  --file="$BACKUP_FILE.sql" \
  --verbose 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    # Compress SQL file
    gzip "$BACKUP_FILE.sql"
    SQL_SIZE=$(du -h "$BACKUP_FILE.sql.gz" | cut -f1)
    success "SQL backup created: $BACKUP_FILE.sql.gz ($SQL_SIZE)"
else
    warn "Failed to create SQL backup (compressed backup still available)"
fi

# Verify backup integrity
log "Verifying backup integrity..."
pg_restore --list "$BACKUP_FILE.dump" > /tmp/backup_verification.txt 2>&1

if [ $? -eq 0 ]; then
    TABLE_COUNT=$(grep -c "TABLE" /tmp/backup_verification.txt)
    success "Backup verified successfully ($TABLE_COUNT tables found)"
else
    error "Backup verification failed"
    exit 1
fi

# Clean up old backups
log "Cleaning up backups older than $RETENTION_DAYS days..."
DELETED_COUNT=0

# Delete old .dump files
while IFS= read -r file; do
    rm -f "$file"
    ((DELETED_COUNT++))
    log "Deleted: $(basename "$file")"
done < <(find "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION_DAYS)

# Delete old .sql.gz files
while IFS= read -r file; do
    rm -f "$file"
    ((DELETED_COUNT++))
    log "Deleted: $(basename "$file")"
done < <(find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS)

if [ $DELETED_COUNT -gt 0 ]; then
    success "Cleaned up $DELETED_COUNT old backup(s)"
else
    log "No old backups to clean up"
fi

# Summary
log "========================================="
success "Backup completed successfully!"
log "========================================="
log "Backup location: $BACKUP_DIR"
log "Latest backup:"
log "  - Compressed: $(basename "$BACKUP_FILE.dump") ($DUMP_SIZE)"
log "  - SQL: $(basename "$BACKUP_FILE.sql.gz") ($SQL_SIZE)"
log ""
log "To restore this backup:"
log "  pg_restore --dbname=\"\$DATABASE_URL\" --clean $BACKUP_FILE.dump"
log "========================================="

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "Total backup storage: $TOTAL_SIZE"

# Count total backups
TOTAL_DUMPS=$(find "$BACKUP_DIR" -name "*.dump" | wc -l)
log "Total backups retained: $TOTAL_DUMPS"

log "Backup process completed at $(date)"

exit 0
