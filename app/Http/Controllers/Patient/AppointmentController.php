<?php

namespace App\Http\Controllers\Patient; 

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\ProfessionalUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class AppointmentController extends Controller
{
    /**
     * Book an appointment
     */
    public function bookAppointment(Request $request)
    {
        // Log the incoming request
        Log::info('Book Appointment API Hit', $request->all());

        // ✅ Validate request
        $validatedData = $request->validate([
            'professional_id' => 'required|string|exists:professional_users,professional_id',
            'appointment_date' => 'required|date|after:today',
            'appointment_type' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        // ✅ Check if the professional exists
        $professional = ProfessionalUser::where('professional_id', $validatedData['professional_id'])->first();
        if (!$professional) {
            Log::error('Professional not found with ID: ' . $validatedData['professional_id']);
            return response()->json([
                'status' => false,
                'message' => 'The selected professional_id is invalid.'
            ], 400);
        }

        // ✅ Create the appointment
        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'professional_id' => $professional->id, // Use correct column (id)
            'appointment_date' => $validatedData['appointment_date'],
            'appointment_type' => $validatedData['appointment_type'],
            'notes' => $validatedData['notes'],
            'status' => 'pending'
        ]);

        Log::info('Appointment booked successfully:', $appointment->toArray());

        return response()->json([
            'status' => true,
            'message' => 'Appointment booked successfully',
            'appointment' => $appointment
        ], 201);
    }

    /**
     * Get all appointments for the authenticated patient
     */
    public function myAppointments()
    {
        $appointments = Appointment::where('patient_id', Auth::id())
            ->with('professional:id,name,field')
            ->get();

        if ($appointments->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No appointments found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'appointments' => $appointments
        ], 200);
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment($id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('patient_id', Auth::id())
            ->first();

        if (!$appointment) {
            return response()->json([
                'status' => false,
                'message' => 'Appointment not found or not authorized'
            ], 404);
        }

        $appointment->update(['status' => 'canceled']);

        return response()->json([
            'status' => true,
            'message' => 'Appointment canceled successfully'
        ], 200);
    }
}
