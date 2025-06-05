<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserManagementController extends Controller
{
    public function index()
    {
        $usermanagements = User::with('roles')->get();
        return Inertia('UserManagements/index', compact('usermanagements'));
    }

    public function create()
    {
        return inertia('UserManagements/create', [
            "roles" => Role::pluck('name')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'email' => 'required|string|max:250',
            'password' => 'required|string|max:250',
            
        ]);

        $user = User::create($request->all(['name', 'email']) + [ 'password' => Hash::make($request->password)]);
        $user->syncRoles([$request->roles]);
        return redirect()->route('usermanagements.index')->with('message', 'Users Creadted Successfully');
    }

    public function edit(User $user){
        return inertia('UserManagements/edit', [
            "user" => $user,
            "userRoles" => $user->roles()->pluck('name'),
            "roles" => Role::pluck('name')
        ]);
    }
    
    public function show(User $user){
        return inertia('UserManagements/show', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string',
            'password' => 'required|string',
        ]);
        
        $user->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
        ]);

        $user->save();

        $user->syncRoles([$request->roles]);

        return to_route('usermanagements.index')->with('message', 'User Updated Successfully');
        // return redirect()->route('usermanagements.index')->with('message', 'User Updated Successfully');        

    }

    public function destroy(User $user){
        $user->delete();
        return redirect()->route('usermanagements.index')->with('message', 'User deleted Successfully');
    }
}
