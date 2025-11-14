<?php

namespace App\Http\Controllers;

use App\Models\PpbHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse; // Pastikan ini ada

class PpbController extends Controller
{
    /**
     * Menampilkan halaman list PPB dengan pagination dan search.
     * (INI FUNGSI YANG DIPERBARUI)
     */
    public function index(Request $request): Response
    {
        $perPage = 10;
        $searchTerm = $request->input('search');

        $ppbs = PpbHeader::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('nomor', 'like', "%{$search}%")
                    ->orWhere('perihal', 'like', "%{$search}%");
            })
            ->orderBy('tanggal', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        $ppbs->getCollection()->transform(function ($ppb) {
            $ppb->grand_total_formatted = 'Rp ' . number_format($ppb->grand_total, 0, ',', '.');
            $ppb->tanggal_formatted = (new \DateTime($ppb->tanggal))->format('d-m-Y');
            return $ppb;
        });

        $totalPpb = PpbHeader::count();
        $totalPending = PpbHeader::where('status', 'pending')->count();
        $totalApproved = PpbHeader::where('status', 'approved')->count();
        $sumApprovedAmount = PpbHeader::where('status', 'approved')->sum('grand_total');

        return Inertia::render('Ppb/Index', [ // <-- Ini akan me-render halaman Index.tsx
            'ppbs' => $ppbs,
            'filter' => $request->only('search'),
            'stats' => [
                'totalPpb' => $totalPpb,
                'totalPending' => $totalPending,
                'totalApproved' => $totalApproved,
                'sumApprovedAmount' => $sumApprovedAmount,
            ],
            'flash' => [
                'message' => session('message')
            ]
        ]);
    }

    /**
     * Menampilkan form untuk membuat PPB baru.
     */
    public function create(): Response
    {
        return Inertia::render('Ppb/CreatePpb');
    }

    /**
     * Menyimpan PPB baru (Header dan Items) ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'required|date',
            'nomor' => 'required|string|max:255|unique:ppb_headers,nomor',
            'lampiran' => 'nullable|string|max:255',
            'perihal' => 'required|string|max:255',
            'kepada_yth_jabatan' => 'required|string|max:255',
            'kepada_yth_nama' => 'required|string|max:255',
            'kepada_yth_lokasi' => 'required|string|max:255',
            'paragraf_pembuka' => 'required|string',
            'dibuat_oleh_nama' => 'required|string|max:255',
            'dibuat_oleh_jabatan' => 'required|string|max:255',
            'menyetujui_1_nama' => 'required|string|max:255',
            'menyetujui_1_jabatan' => 'required|string|max:255',
            'menyetujui_2_nama' => 'required|string|max:255',
            'menyetujui_2_jabatan' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.nama_barang' => 'required|string|max:255',
            'items.*.jumlah' => 'required|numeric|min:1',
            'items.*.satuan' => 'required|string|max:50',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.keterangan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            $grandTotal = 0;
            foreach ($request->items as $item) {
                $grandTotal += $item['jumlah'] * $item['harga_satuan'];
            }

            $header = PpbHeader::create(
                array_merge($request->except('items'), [
                    'grand_total' => $grandTotal
                ])
            );

            foreach ($request->items as $itemData) {
                $header->items()->create([
                    'nama_barang' => $itemData['nama_barang'],
                    'jumlah' => $itemData['jumlah'],
                    'satuan' => $itemData['satuan'],
                    'harga_satuan' => $itemData['harga_satuan'],
                    'harga_total' => $itemData['jumlah'] * $itemData['harga_satuan'],
                    'keterangan' => $itemData['keterangan'],
                ]);
            }

            DB::commit();
            
            return redirect()->route('ppb.show', $header->id)->with('message', 'Pengajuan Permintaan Barang berhasil dibuat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['db' => 'Gagal menyimpan data ke database: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Menampilkan detail PPB yang sudah dibuat (format surat).
     */
    public function show(string $id): Response
    {
        $ppb = PpbHeader::with('items')->findOrFail($id);

        return Inertia::render('Ppb/ShowPpb', [
            'ppb' => $ppb,
        ]);
    }

    /**
     * Menghapus data PPB.
     * (INI FUNGSI YANG BARU)
     */
    public function destroy(PpbHeader $ppb): RedirectResponse
    {
        $ppb->delete(); // onDelete('cascade') akan menghapus items

        return redirect()->route('ppb.index')->with('message', 'Pengajuan PPB berhasil dihapus.');
    }
}