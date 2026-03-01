<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Super Admin (no tenant)
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@chatbot.test',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
            'tenant_id' => null,
            'is_active' => true,
        ]);

        // Create a demo tenant
        $tenant = Tenant::create([
            'name' => 'Demo Company',
            'slug' => 'demo',
            'plan_type' => 'pro',
            'status' => 'active',
            'ai_config' => [
                'provider' => 'openai',
                'model' => 'gpt-4o',
                'system_prompt' => 'You are a helpful customer support assistant for Demo Company. Be polite and concise in your responses.',
                'temperature' => 0.7,
                'max_tokens' => 1024,
            ],
            'settings' => [
                'locale' => 'az',
                'timezone' => 'Asia/Baku',
            ],
        ]);

        // Create tenant admin
        User::create([
            'name' => 'Demo Admin',
            'email' => 'demo@chatbot.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'tenant_id' => $tenant->id,
            'is_active' => true,
        ]);
    }
}
