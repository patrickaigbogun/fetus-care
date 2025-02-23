<?php

namespace App\Http\Controllers\Patient;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info('Register API Hit', $request->all());
    
        // ✅ Validate request
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
    
        if ($validator->fails()) {
            \Log::error('Validation failed', $validator->errors()->toArray());
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }
    
        try {
            \Log::info('Creating user...');
    
            // ✅ Create user
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(),
            ]);
    
            \Log::info('User created:', $user->toArray());
    
            // ✅ Generate auth token
            $token = $user->createToken('auth_token')->plainTextToken;
            \Log::info('Token generated:', ['token' => $token]);
    
            // ✅ Force Laravel to return response IMMEDIATELY
            ob_end_clean(); // Clears output buffer to prevent any unwanted output
    
            return response()->json([
                'status' => true,
                'message' => 'User registered successfully',
                'token' => $token,
                'user' => $user
            ], 201);
    
        } catch (\Exception $e) {
            \Log::error('Server error: ' . $e->getMessage());
    
            return response()->json([
                'status' => false,
                'message' => 'Server error, please try again',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
            

    public function oldregister(Request $request)
{
    // Validate request
    $validator = Validator::make($request->all(), [
        'username' => 'required|string|unique:users', 
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:6|confirmed',
    ]);

    // If validation fails, return error response
    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 400)->header('Content-Type', 'application/json');
    }

    // Create user with username inside users table
    $user = User::create([
        'username' => $request->username,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'email_verified_at' => now(),
    ]);

    // Generate auth token
    $token = $user->createToken('auth_token')->plainTextToken;

    // Add explicit headers and ensure proper JSON encoding
    return response()->json([
        'status' => true,
        'message' => 'User registered successfully',
        'token' => $token,
        'user' => $user
    ], 200)
    ->header('Content-Type', 'application/json')
    ->header('Access-Control-Allow-Origin', '*')
    ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // ->header('AUTHORIZATION_TOKEN', $token);
}

    public function login(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
    
        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }
    
        // Find user by username
        $user = User::where('username', $request->username)->first();
    
        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }
    
        // Generate auth token
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    public function logout(Request $request)
    {
    $request->user()->tokens()->delete();

    return response()->json([
        'status' => true,
        'message' => 'Logged out successfully'
    ], 200);
    }   

}
