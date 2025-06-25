<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class NotaController extends Controller
{
    public function index()
    {
        $perPage = 10; // Jumlah item per halaman, bisa disesuaikan
        $notas = Nota::orderBy('created_at', 'DESC')->paginate($perPage);

        return Inertia::render("Notas/index", [
            "notas" => $notas,
        ]);
    }

    public function up_nota()
    {
        return Inertia('Notas/up_nota');
    }

    public function c_nota(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
            'file' => 'nullable|image|mimes:jpeg,png,jpg,gif,pdf,csv,xls|max:2048',
        ]);

        // Cek duplikasi berdasarkan hash file
        $fileHash = md5_file($request->file('file')->getRealPath());
        $existing = Nota::where('name', $request->name)
                    ->where('date', $request->date)
                    ->where('devisi', $request->devisi)
                    ->where('dana', $request->dana)
                    ->where('file_hash', $fileHash)
                    ->exists();

        if ($existing) {
            return back()->with('error', 'Data dengan file yang sama sudah ada!, Jika baru ganti nama file nya ya :)');
        }

        // Gunakan DB transaction
        return DB::transaction(function () use ($request) {
            // Proses file
            $file = $request->file('file');
            // Pisahkan nama file dan ekstensi
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension(); // Ambil ekstensi asli (misalnya 'png', 'jpg')
            $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME); // Ambil nama tanpa ekstensi
            $sluggedName = Str::slug($nameWithoutExtension); // Slug hanya pada nama
            $filename = 'nota_'.time().'_'.$sluggedName.'.'.$extension; // Gabungkan kembali dengan ekstensi
            $path = $file->storeAs('public/notas', $filename);

            // Simpan file menggunakan Storage disk
            $disk = Storage::disk('public');
            $path = $disk->putFileAs('notas', $file, $filename);

            // Pastikan file tersimpan dengan benar
            $fullPath = storage_path('app/public/notas/' . $filename);
            if (!file_exists($fullPath)) {
                throw new \Exception("File gagal disimpan di: " . $fullPath);
            }
            
            // Simpan data SEKALI saja
            $nota = Nota::create([
                'name' => $request->name,
                'date' => $request->date,
                'devisi' => $request->devisi,
                'mengetahui' => $request->mengetahui,
                'desk' => $request->desk,
                'dana' => $request->dana,
                'file' => 'storage/notas/'.$filename,
                'file_hash' => md5_file($file->getRealPath()),
                // 'status' => 'belum ACC'
            ]);

            return redirect()->route('notas.index')->with('success', 'Invoice Created Successfully');
        });     
    }

    public function show(string $id)
    {
        $nota = Nota::find($id);
        return Inertia::render("Notas/show", [
            "nota" => $nota,
        ]);
    }

    public function edit(string $id)
    {
        $nota = Nota::find($id);
        return Inertia::render("Notas/edit", [
            "nota" => $nota,
        ]);
    }

    public function update(Request $request, Nota $nota)
    {
        Log::info('Memulai fungsi update untuk nota ID: ' . $nota->id);

        // Validasi input
        $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
            
        ]);

        Log::info('Validasi input selesai');

        // Gunakan DB transaction
        return DB::transaction(function () use ($request, $nota) {
            Log::info('Memulai transaksi database');
            
            // Perbarui data
            $nota->update([
                'name' => $request->input('name'),
                'date' => $request->input('date'),
                'devisi' => $request->input('devisi'),
                'mengetahui' => $request->input('mengetahui'),
                'desk' => $request->input('desk'),
                'dana' => $request->input('dana'),
   
            ]);

            Log::info('Data nota ID: ' . $nota->id . ' berhasil diperbarui');

            return redirect()->route('notas.index')->with('success', 'Nota Updated Successfully');
        });
    }

    public function showAct(string $id)
    {
        $nota = Nota::find($id);
        return Inertia::render("Notas/showAct", [
            "nota" => $nota,
        ]);
    }

    public function editAct(string $id)
    {
        $nota = Nota::find($id);
        return Inertia::render("Notas/editAct", [
            "nota" => $nota,
        ]);
    }

    public function updateAct(Request $request, Nota $nota)
    {
        Log::info('Memulai fungsi update untuk nota ID: ' . $nota->id);

        // Validasi input
        $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
            'status' => 'required|string|max:250',
            'reason' => 'required|string|max:250',
            
        ]);

        Log::info('Validasi input selesai');

        // Gunakan DB transaction
        return DB::transaction(function () use ($request, $nota) {
            Log::info('Memulai transaksi database');
            
            // Perbarui data
            $nota->update([
                'name' => $request->input('name'),
                'date' => $request->input('date'),
                'devisi' => $request->input('devisi'),
                'mengetahui' => $request->input('mengetahui'),
                'desk' => $request->input('desk'),
                'dana' => $request->input('dana'),
                'status' => $request->input('status'),
                'reason' => $request->input('reason'),
   
            ]);

            Log::info('Data nota ID: ' . $nota->id . ' berhasil diperbarui');

            return redirect()->route('administrasis.index')->with('success', 'Nota Updated Successfully');
        });
    }

    public function destroy(Nota $nota){
        $nota->delete();
        return redirect()->route('notas.index')->with('message', 'Invoice deleted Successfully');
    }
}
