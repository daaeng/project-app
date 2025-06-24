<?php

namespace App\Http\Controllers;

use App\Models\Kasbon;
use App\Models\Incisor;
use App\Models\Incised;
use Illuminate\Http\Request;

class KasbonController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'incised_id' => 'required|exists:inciseds,id',
            'kasbon' => 'required|numeric|min:0',
            'status' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
        ]);

        $incisor = Incisor::findOrFail($validated['incisor_id']);
        $incised = Incised::findOrFail($validated['incised_id']);

        if ($incisor->no_invoice !== $incised->no_invoice) {
            return response()->json(['error' => 'No invoice tidak cocok'], 422);
        }

        // Hitung gaji berdasarkan total amount per bulan
        $month = $incised->date->format('m');
        $year = $incised->date->format('Y');
        $totalAmount = Incised::where('no_invoice', $incised->no_invoice)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');
        $gaji = $totalAmount * 0.5;

        // Simpan kasbon
        $kasbon = Kasbon::create(array_merge($validated, ['gaji' => $gaji]));

        return response()->json([
            'message' => 'Kasbon created successfully',
            'data' => [
                'id' => $kasbon->id,
                'incisor' => $kasbon->incisor->name,
                'gaji' => $kasbon->gaji,
                'kasbon' => $kasbon->kasbon,
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'amount' => $kasbon->incised->amount,
            ]
        ], 201);
    }

    public function index()
    {
        $kasbons = Kasbon::with(['incisor', 'incised'])->get();
        return response()->json($kasbons->map(function ($kasbon) {
            return [
                'id' => $kasbon->id,
                'incisor' => $kasbon->incisor->name,
                'gaji' => $kasbon->gaji,
                'kasbon' => $kasbon->kasbon,
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'no_invoice' => $kasbon->incised->no_invoice,
            ];
        }));
    }
}