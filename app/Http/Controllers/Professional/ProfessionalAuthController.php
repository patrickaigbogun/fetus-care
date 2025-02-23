<?php

namespace App\Http\Controllers\Professional;

use Illuminate\Http\Request;
use App\Models\ProfessionalUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

class ProfessionalAuthController extends Controller
{
    /**
     * Register a new professional user.
     */
    public function register(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'field' => 'required|string|max:255',
            'phone_number' => 'required|string|unique:professional_users',
            'email' => 'required|string|email|unique:professional_users',
            'password' => 'required|string|min:6|confirmed',
             'grade' => 'nullable|integer|min:0|max:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        // Auto-generate professional ID (e.g., PROF-ABC123)
        $professionalId = 'PROF-' . strtoupper(Str::random(6));

        // Create professional user
        $professional = ProfessionalUser::create([
            'professional_id' => $professionalId,
            'name' => $request->name,
            'field' => $request->field,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'grade' => $request->grade ?? 0,
            'email_verified_at' => now(),
        ]);

        $token = $professional->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Professional user registered successfully',
            'professional_id' => $professionalId, // ✅ Include the auto-generated ID in the response
            'token' => $token,
            'user' => $professional
        ], 201);
    }

    /**
     * Login a professional user.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $professional = ProfessionalUser::where('email', $request->email)->first();

        if (!$professional || !Hash::check($request->password, $professional->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $professional->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $professional
        ], 200);
    }

    /**
     * Logout a professional user.
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout successful'
        ], 200);
    }

     /**
     * Get all professionals and their fields
     */
    public function index()
{
    $professionals = ProfessionalUser::all(); // Fetch all fields

    if ($professionals->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'No professionals found'
        ], 404);
    }

    return response()->json([
        'status' => true,
        'professionals' => $professionals
    ], 200);
}

}
