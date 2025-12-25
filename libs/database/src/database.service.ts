import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    if (this.dataSource.driver.options.type === 'postgres') {
      await this.setupPgTrgmIndex();
    }
  }

  private async setupPgTrgmIndex(): Promise<void> {
    try {
      await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
      this.logger.log('pg_trgm extension enabled');

      await this.dataSource.query(
        `CREATE INDEX IF NOT EXISTS idx_fullname_gin ON users USING gin (full_name gin_trgm_ops);`,
      );
      this.logger.log('GIN index on full_name created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to setup pg_trgm index: ${message}`);
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  isConnected(): boolean {
    return this.dataSource.isInitialized;
  }

  async runMigrations(): Promise<void> {
    await this.dataSource.runMigrations();
  }

  async revertMigration(): Promise<void> {
    await this.dataSource.undoLastMigration();
  }
}
