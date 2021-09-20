<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name' => 'required | string',
            'email' => 'required | string | email | unique:users',
            'password' => 'required | string | confirmed'
        ]);

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $user = $user->save();

        $credentials = ['email' => $request->email, 'password' => $request->password];

        if(!Auth::attempt($credentials)){
            return response()->json([
                'message' => 'Giriş Yapılamadı Bilgileri Kontrol Ediniz'
            ],401);
        }

        $user = $request->user();

        $tokenResult = $user->createToken("Personal Access");
        $token = $tokenResult->token;
        if($request->remember_me){
            $token->expires_at = Carbon::now()->addWeeks(1);
        }

        $token->save();

        return response([
            'success' => true,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($tokenResult->token->expires_at)->toDateTimeString()
        ],201);
    }


    public function login(Request $request){
        $request->validate([
            'email' => 'required | string | email',
            'password' => 'required | string',
            'remember_me' => 'boolean'
        ]);

        $credential = request(['email','password']);

        if(!Auth::attempt($credential)){
            return response()->json([
                'message' => 'Giriş Bilgileri Hatalı'
            ],401);
        }

        $user = $request->user();
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;

        if($request->remember_me){
            $token->expires_at = Carbon::now()->addWeeks(1);
        }

        $token->save();

        return response([
            'success' => true,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($tokenResult->token->expires_at)->toDateTimeString()
        ],201);

    }


    public function logout(Request $request){
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Çıkış Yapıldı'
        ],201);
    }

    public function getUser(Request $request){
        return response()->json($request->user());
    }

    public function authenticate(Request $request){
        $user = [];
        if(Auth::check()){
            $user = $request->user();
        }
        return response()->json([
            'user'=>$user,
            'isLoggedIn'=>Auth::check()
        ]);
    }
}
