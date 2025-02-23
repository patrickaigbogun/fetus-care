<?php

namespace App\Http\Controllers\Patient; 

use Illuminate\Http\Request;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class UserProfileController extends Controller
{

    public function getAllProfiles()
{
    // Retrieve all user profiles
    $profiles = UserProfile::with('user')->get();

    if ($profiles->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'No user profiles found'
        ], 404);
    }

    return response()->json([
        'status' => true,
        'profiles' => $profiles
    ], 200);
}



    /**
     * Store a new user profile.
     */
    public function store(Request $request)
    {
        // Manually validate request
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'country' => 'required|string',
            'state' => 'required|string',
            'age' => 'required|integer|min:1',
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        // Get the authenticated user
        $user = Auth::user();

        // Handle profile image upload
        $profileImage = null;
        if ($request->hasFile('profile_image')) {
            $profileImage = $request->file('profile_image')->store('profile_images', 'public');
        }

        // Create user profile
        $profile = UserProfile::create([
            'user_id' => $user->id,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'profile_image' => $profileImage,
            'country' => $request->country,
            'state' => $request->state,
            'age' => $request->age,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Profile created successfully',
            'profile' => $profile
        ], 201);
    }

    /**
     * Get the authenticated user's profile.
     */
    public function show()
    {
        $user = Auth::user();
    
        // Check if the user has a profile
        $profile = UserProfile::where('user_id', $user->id)->first();
    
        if (!$profile) {
            return response()->json([
                'status' => false,
                'message' => 'Profile not found for this user'
            ], 404);
        }
    
        return response()->json([
            'status' => true,
            'profile' => $profile
        ], 200);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = Auth::user(); // Get authenticated user
    
        // Check if the user has a profile
        $profile = UserProfile::where('user_id', $user->id)->first();
    
        if (!$profile) {
            return response()->json([
                'status' => false,
                'message' => 'Profile not found for this user'
            ], 404);
        }
    
        // Manually validate request
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'country' => 'required|string',
            'state' => 'required|string',
            'age' => 'required|integer|min:1',
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        // Handle profile image update
        if ($request->hasFile('profile_image')) {
            $profileImage = $request->file('profile_image')->store('profile_images', 'public');
        } else {
            $profileImage = $profile->profile_image; // Keep existing image if not provided
        }

        // ✅ Force Replace ALL Data
        $profile->forceFill([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'profile_image' => $profileImage,
            'country' => $request->country,
            'state' => $request->state,
            'age' => $request->age,
        ])->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ], 200);
    }

    /**
     * Delete the authenticated user's profile.
     */
    public function destroy()
    {
        $profile = Auth::user()->profile;

        if (!$profile) {
            return response()->json([
                'status' => false,
                'message' => 'Profile not found'
            ], 404);
        }

        $profile->delete();

        return response()->json([
            'status' => true,
            'message' => 'Profile deleted successfully'
        ], 200);
    }
}
