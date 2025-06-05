<?php

namespace App\Http\Controllers;

use App\Models\Requested;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class RequestController extends Controller
{
   public function index()
   {
      $requests = Requested::orderBy('created_at', 'DESC')->get();
         return Inertia::render("Requests/index", [
               "requests" => $requests,
         ]);

      // $requests = Requested::all();
      // return Inertia('Requests/index', compact('requests'));
   }

   public function create()
   {
      return Inertia('Requests/create');
   }

   public function surat(Request $request)
   {
         // Validasi input
         $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string|max:250',
            'j_pengajuan' => 'required|string|max:250',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:2048', // Validasi MIME type
         ], [
            'file.max' => 'Ukuran file maksimal adalah 2MB.',
            'file.mimes' => 'File harus berupa PDF, DOC, DOCX, XLS, atau XLSX.',
         ]);

         Log::info('Validasi input selesai');

         // Validasi ekstensi file secara manual (tambahan keamanan)
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
            
            // Debugging MIME type dan ekstensi
            $mimeType = $file->getMimeType();
            Log::info('MIME type file: ' . $mimeType . ', File name: ' . $file->getClientOriginalName() . ', Extension: ' . $extension);

            if (!in_array($extension, $allowedExtensions)) {
                Log::error('Ekstensi file tidak diizinkan: ' . $extension);
                return back()->withErrors(['file' => 'File harus berupa PDF, DOC, DOCX, XLS, atau XLSX.']);
            }
        } else {
            Log::info('Tidak ada file yang diunggah');
        }

         // Cek duplikasi berdasarkan hash file
         if ($request->hasFile('file')) {
            $fileHash = md5_file($request->file('file')->getRealPath());
            $existing = Requested::where('name', $request->name)
                        ->where('date', $request->date)
                        ->where('devisi', $request->devisi)
                        ->where('file_hash', $fileHash)
                        ->exists();

            if ($existing) {
                  Log::warning('Data duplikat ditemukan');
                  return back()->with('error', 'Data dengan file yang sama sudah ada! Jika baru, ganti nama file-nya ya :)');
            }
            Log::info('Cek duplikasi selesai, tidak ada duplikat');
         }

         // Gunakan DB transaction
         try {
            return DB::transaction(function () use ($request) {
                  Log::info('Memulai transaksi database');

                  $filePath = null;
                  $fileHash = null;

                  if ($request->hasFile('file')) {
                     $file = $request->file('file');
                     $originalName = $file->getClientOriginalName();
                     $extension = $file->getClientOriginalExtension();
                     $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME);
                     $sluggedName = Str::slug($nameWithoutExtension);
                     $filename = 'request_'.time().'_'.$sluggedName.'.'.$extension;

                     // Simpan file menggunakan Storage disk
                     $disk = Storage::disk('public');
                     $path = $disk->putFileAs('requests', $file, $filename);

                     Log::info('File disimpan di: ' . $path);

                     // Pastikan file tersimpan dengan benar
                     $fullPath = storage_path('app/public/requests/' . $filename);
                     if (!file_exists($fullPath)) {
                        Log::error('File gagal disimpan di: ' . $fullPath);
                        throw new \Exception("File gagal disimpan di: " . $fullPath);
                     }

                     $filePath = 'storage/requests/'.$filename;
                     $fileHash = md5_file($file->getRealPath());
                     Log::info('File berhasil disimpan: ' . $filePath);
                  } else {
                     Log::info('Tidak ada file untuk disimpan');
                  }

                  // Log data yang akan disimpan
                  $dataToSave = [
                     'name' => $request->name,
                     'date' => $request->date,
                     'devisi' => $request->devisi,
                     'j_pengajuan' => $request->j_pengajuan,
                     'mengetahui' => $request->mengetahui,
                     'desk' => $request->desk,
                     'file' => $filePath,
                     'file_hash' => $fileHash,
                     'status' => 'belum ACC', // Default status
                     'reason' => null, // Default reason
                     'created_at' => now(), // Default created_at
                     'updated_at' => now(), // Default updated_at
                  ];
                  Log::info('Data yang akan disimpan: ' . json_encode($dataToSave));

                  // Simpan data
                  $requested = Requested::create($dataToSave);

                  Log::info('Data berhasil disimpan ke database, ID: ' . $requested->id);

                  return redirect()->route('requests.index')->with('success', 'Request Created Successfully');
            });
         } catch (Throwable $e) {
            Log::error('Gagal menyimpan data ke database: ' . $e->getMessage());
            // Hapus file jika sudah disimpan tetapi transaksi gagal
            if (isset($filePath) && Storage::disk('public')->exists('requests/' . basename($filePath))) {
                  Storage::disk('public')->delete('requests/' . basename($filePath));
                  Log::info('File dihapus karena transaksi gagal: ' . $filePath);
            }
            return back()->with('error', 'Gagal menyimpan data ke database: ' . $e->getMessage());
         }
   }

   public function destroy(Requested $requested){
        $requested->delete();
        return redirect()->route('requests.index')->with('message', 'Request deleted Successfully');
    }

}




      // -------------------------------------------
      // $request->validate([
      //    'name' => 'required|string|max:250',
      //    'date' => 'required|date',
      //    'devisi' => 'required|string',
      //    'j_pengajuan' => 'required|string|max:250',
      //    'mengetahui' => 'required|string|max:250',
      //    'desk' => 'nullable|string',
      //    'file' => 'required|string',
      // ]);

      
      //    // Cek duplikasi berdasarkan hash file
      //    $fileHash = md5_file($request->file('file')->getRealPath());
      //    $existing = Requested::where('name', $request->name)
      //                ->where('date', $request->date)
      //                ->where('devisi', $request->devisi)
      //                ->where('file_hash', $fileHash)
      //                ->exists();

      //    if ($existing) {
      //          return back()->with('error', 'Data dengan file yang sama sudah ada!, Jika baru ganti nama file nya ya :)');
      //    }

      //   // Gunakan DB transaction
      //    return DB::transaction(function () use ($request) {
      //       // Proses file
      //       $file = $request->file('file');
      //       // Pisahkan nama file dan ekstensi
      //       $originalName = $file->getClientOriginalName();
      //       $extension = $file->getClientOriginalExtension(); // Ambil ekstensi asli (misalnya 'png', 'jpg')
      //       $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME); // Ambil nama tanpa ekstensi
      //       $sluggedName = Str::slug($nameWithoutExtension); // Slug hanya pada nama
      //       $filename = 'requested_'.time().'_'.$sluggedName.'.'.$extension; // Gabungkan kembali dengan ekstensi
      //       $path = $file->storeAs('public/requests', $filename);

      //       // Simpan file menggunakan Storage disk
      //       $disk = Storage::disk('public');
      //       $path = $disk->putFileAs('requests', $file, $filename);

      //       // Pastikan file tersimpan dengan benar
      //       $fullPath = storage_path('app/public/requests/' . $filename);
      //       if (!file_exists($fullPath)) {
      //           throw new \Exception("File gagal disimpan di: " . $fullPath);
      //       }
            
      //       // Simpan data SEKALI saja
      //       $requested = Requested::create([
      //           'name' => $request->name,
      //           'date' => $request->date,
      //           'devisi' => $request->devisi,
      //           'mengetahui' => $request->mengetahui,
      //           'desk' => $request->desk,
      //           'file' => 'storage/requests/'.$filename,
      //           'file_hash' => md5_file($file->getRealPath()),
      //           // 'status' => 'belum ACC'
      //       ]);

      //       return redirect()->route('requests.index')->with('success', 'Invoice Created Successfully');
      //    }); 
      // Requested::create($request->all());
      // return redirect()->route('requests.index')->with('message', 'Submission Creadted Successfully');        