<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'professional_id', 'appointment_date', 'appointment_type', 'notes', 'status'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function professional()
    {
        return $this->belongsTo(ProfessionalUser::class, 'professional_id');
    }
}
