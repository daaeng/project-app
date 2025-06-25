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
      $perPage = 10; // Jumlah item per halaman, bisa disesuaikan
      $requests = Requested::orderBy('created_at', 'DESC')->paginate($perPage);

      return Inertia::render("Requests/index", [
         "requests" => $requests,
      ]);
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
            'dana' => 'required|numeric',
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,pdf,csv,xls|max:2048', 
         
         ]);

         Log::info('Validasi input selesai');

         // Cek duplikasi berdasarkan hash file
         $fileHash = md5_file($request->file('file')->getRealPath());
         $existing = Requested::where('name', $request->name)
                        ->where('date', $request->date)
                        ->where('devisi', $request->devisi)
                        ->where('j_pengajuan', $request->j_pengajuan)
                        ->where('file_hash', $fileHash)
                        ->where('dana', $request->dana)
                        ->exists();

         if ($existing) {
            return back()->with('error', 'Data dengan file yang sama sudah ada!, Jika baru ganti nama file nya ya :)');
         }

         return DB::transaction(function () use ($request) {
            // Proses file
            $file = $request->file('file');
            // Pisahkan nama file dan ekstensi
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension(); // Ambil ekstensi asli (misalnya 'png', 'jpg')
            $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME); // Ambil nama tanpa ekstensi
            $sluggedName = Str::slug($nameWithoutExtension); // Slug hanya pada nama
            $filename = 'request_'.time().'_'.$sluggedName.'.'.$extension; // Gabungkan kembali dengan ekstensi
            $path = $file->storeAs('public/requesteds', $filename);

            // Simpan file menggunakan Storage disk
            $disk = Storage::disk('public');
            $path = $disk->putFileAs('requesteds', $file, $filename);

            // Pastikan file tersimpan dengan benar
            $fullPath = storage_path('app/public/requesteds/' . $filename);
            if (!file_exists($fullPath)) {
                  throw new \Exception("File gagal disimpan di: " . $fullPath);
            }
            
            // Simpan data SEKALI saja
            $requested = Requested::create([
               'name' => $request->name,
               'date' => $request->date,
               'devisi' => $request->devisi,
               'j_pengajuan' => $request->j_pengajuan,
               'mengetahui' => $request->mengetahui,
               'desk' => $request->desk,
               'dana' => $request->dana,
               'file' => 'storage/requesteds/'.$filename,
               'file_hash' => md5_file($file->getRealPath()),
                  // 'status' => 'belum ACC'
            ]);

            return redirect()->route('requests.index')->with('success', 'Invoice Created Successfully');
         });

   }

   public function show(string $id)
   {
      $requested = Requested::find($id);
      return Inertia::render("Requests/show", [
         "requests" => $requested,
      ]);
   }

   public function edit(string $id)
   {
      $requested = Requested::find($id);
      return Inertia::render("Requests/edit", [
         "requests" => $requested,
         // dd($requested)
      ]);
   }

   public function update(Request $request, Requested $requested)
      {
         // Validasi input
         $request->validate([
            'name' => 'required|string|max:250',
            'date' => 'required|date',
            'devisi' => 'required|string|max:250',
            'j_pengajuan' => 'required|string|max:250',
            'mengetahui' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'dana' => 'required|numeric',
            // 'file' => 'required|image|mimes:jpeg,png,jpg,gif,pdf,csv,xls|max:2048', 
            
         ]);

         Log::info('Validasi input selesai');

         // Gunakan DB transaction
         return DB::transaction(function () use ($request, $requested) {
            Log::info('Memulai transaksi database');
            
            // Perbarui data
            $requested->update([
                  'name' => $request->input('name'),
                  'date' => $request->input('date'),
                  'devisi' => $request->input('devisi'),
                  'j_pengajuan' => $request->input('j_pengajuan'),
                  'mengetahui' => $request->input('mengetahui'),
                  'desk' => $request->input('desk'),
                  'dana' => $request->input('dana'),
                  // 'dana' => $request->input('dana'),

            ]);

            return redirect()->route('requests.index')->with('success', 'Requested Updated Successfully');
         });
      }
   
   public function showAct(string $id)
   {
      $requested = Requested::find($id);
      return Inertia::render("Requests/showAct", [
         "requests" => $requested,
      ]);
   }

   public function editAct(string $id)
   {
      $requested = Requested::find($id);
      return Inertia::render("Requests/editAct", [
         "requests" => $requested,
         // dd($requested)
      ]);
   }

   public function updateAct(Request $request, Requested $requested)
   {
      // Validasi input
      $request->validate([
         'name' => 'required|string|max:250',
         'date' => 'required|date',
         'devisi' => 'required|string|max:250',
         'j_pengajuan' => 'required|string|max:250',
         'mengetahui' => 'required|string|max:250',
         'desk' => 'nullable|string',
         'dana' => 'required|numeric',
         'status' => 'required|string|max:250',
         'reason' => 'required|string|max:250',
         // 'file' => 'required|image|mimes:jpeg,png,jpg,gif,pdf,csv,xls|max:2048', 
         
      ]);

      Log::info('Validasi input selesai');

      // Gunakan DB transaction
      return DB::transaction(function () use ($request, $requested) {
         Log::info('Memulai transaksi database');
         
         // Perbarui data
         $requested->update([
            'name' => $request->input('name'),
            'date' => $request->input('date'),
            'devisi' => $request->input('devisi'),
            'j_pengajuan' => $request->input('j_pengajuan'),
            'mengetahui' => $request->input('mengetahui'),
            'desk' => $request->input('desk'),
            'dana' => $request->input('dana'),
            'status' => $request->input('status'),
            'reason' => $request->input('reason'),
         ]);

         return redirect()->route('administrasis.index')->with('success', 'Requested Updated Successfully');
      });
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