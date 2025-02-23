<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WebhookController extends Controller
{
    /**
     * Handle incoming webhooks for authentication.
     */
    public function handleAuthWebhook(Request $request)
{
    Log::info('Received Webhook:', $request->all());

    // ✅ Extract `data` object safely
    $webhookData = $request->input('data', []);

    // ✅ Extract fields safely
    $firstName = $webhookData['first_name'] ?? null;
    $lastName = $webhookData['last_name'] ?? null;
    $externalId = $webhookData['id'] ?? null;
    $emailAddresses = $webhookData['email_addresses'] ?? [];
    $email = $emailAddresses[0]['email_address'] ?? null;

    // ✅ Validate manually
    $validator = Validator::make([
        'first_name' => $firstName,
        'last_name' => $lastName,
        'id' => $externalId,
        'email_address' => $email,
    ], [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'id' => 'required|string|unique:users,external_id',
        'email_address' => 'required|email|unique:users,email',
    ]);

    if ($validator->fails()) {
        Log::error('Validation failed', $validator->errors()->toArray());
        return response()->json([
            'status' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 400);
    }

    // ✅ Check if user exists
    $user = User::firstOrCreate(
        ['external_id' => $externalId],
        [
            'username' => strtolower($firstName . '.' . $lastName),
            'email' => $email,
            'password' => Hash::make(uniqid()),
        ]
    );

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status' => true,
        'message' => 'User authenticated successfully via webhook',
        'token' => $token,
        'user' => $user
    ], 200);
}

    

    
}
