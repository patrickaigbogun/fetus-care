<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProfessionalAppointmentController extends Controller
{
    /**
     * ✅ Get all appointments for the authenticated professional
     */
    public function getProfessionalAppointments()
    {
        Log::info("Fetching appointments for Professional ID:", ['id' => Auth::id()]);

        // Fetch appointments where the professional is assigned
        $appointments = Appointment::where('professional_id', Auth::id())
            ->with('patient:id,username,email')
            ->get();

        if ($appointments->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No appointments found for this professional'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'appointments' => $appointments
        ], 200);
    }

    public function updateAppointmentStatus(Request $request, $id)
{
    // ✅ Log the incoming request and appointment ID
    Log::info("Raw Request Data:", ['request' => $request->all()]);
    Log::info("Received Appointment ID:", ['id' => $id]);

    // ✅ Convert `id` to an integer to prevent invalid input
    $id = intval($id);

    // ✅ Validate the request
    $request->validate([
        'status' => 'required|string|in:approved,canceled'
    ]);

    // ✅ Find the appointment or return a 404 if not found
    $appointment = Appointment::findOrFail($id);

    // ✅ Ensure the authenticated professional owns this appointment
    if ($appointment->professional_id !== Auth::id()) {
        Log::error("Unauthorized access to appointment", [
            'appointment_id' => $id,
            'professional_id' => Auth::id()
        ]);
        return response()->json([
            'status' => false,
            'message' => 'You are not authorized to update this appointment'
        ], 403);
    }

    // ✅ Update the appointment status
    $appointment->update(['status' => $request->status]);

    return response()->json([
        'status' => true,
        'message' => 'Appointment status updated successfully',
        'appointment' => $appointment
    ], 200);
}


    
}
