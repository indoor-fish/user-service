import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.enum('role', ['CUSTOMER', 'MERCHANT', 'ADMIN']).notNullable().defaultTo('CUSTOMER');
    table.boolean('suspended').notNullable().defaultTo(false);
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.integer('failed_login_attempts').notNullable().defaultTo(0);
    table.timestamp('locked_until').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
