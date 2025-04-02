<?php

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\APINav;
use App\Http\Controllers\APIDashboard;
use App\Http\Controllers\APIGraphs;
use App\Http\Controllers\APIBairro;
use App\Http\Controllers\APIRede;
use App\Http\Controllers\APIUser;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('users', function (Request $request) {
    $user = \App\Models\User::query()->where('whatsapp', $request->whatsapp)->first();

    try {
        $nascimento = \Carbon\Carbon::createFromFormat('dmY', $request->nascimento);

        if ($nascimento === false) {
            throw new Exception('Invalid date value.');
        }
    } catch (\Exception $e) {
        $nascimento = null;
    }

    function normalizarNome($campo) {
        $nome = trim($campo);
        $mapeamento = array(
            "rj" => "Rio de Janeiro",
            "rio de janeiro"=> "Rio de Janeiro",
            "rio"=> "Rio de Janeiro",
            "campo grande"=> "Campo Grande",
            "cg"=> "Campo Grande",
            "campo-grande"=> "Campo Grande",
            "campo grande rj"=> "Campo Grande",
            "cosmos"=> "Cosmos",
            "barra da tijuca"=> "Barra da Tijuca",
            "barra"=> "Barra da Tijuca",
            "freguesia, jacarepaguá"=> "Freguesia",
            "freguesia - jacarepaguá"=> "Freguesia",
            "recreio dos bandeirantes"=> "Recreio",
            "são joão de meriti"=> "São João de Meriti",
            "nova iguaçu"=> "Nova Iguaçu",
            "nilopolis"=> "Nilópolis",
            "inhauma"=> "Inhaúma",
            "ilha do governador"=> "Ilha do Governador",
            "barra de guaratiba"=> "Barra de Guaratiba",

        );

        $nomeNormalizado = isset($mapeamento[strtolower($nome)]) ? $mapeamento[strtolower($nome)] : $nome;

        return $nomeNormalizado;
    }

    $bairroNormalizado = normalizarNome($request->bairro);
    $cidadeNormalizada = normalizarNome($request->cidade);

    $data = [
        'name' => $request->name,
        'email' => $request->email,
        'whatsapp' => $request->whatsapp,
        'nascimento' => $nascimento?->format('Y-m-d'),
        'idade' => $nascimento?->diffInYears(Carbon::now()),
        'sexo' => $request->sexo,
        'bairro' => $bairroNormalizado,
        'cidade' => $cidadeNormalizada,
        'zona_eleitoral' => $request->zona_eleitoral,
    ];

    $data = array_filter($data, function($value) {
        return !empty($value);
    });

    if ($user) {
        $user->update($data);
    } else {
        $link_afiliado = null;

        if (preg_match('/\((.*?)\)/', $request->link_afiliado, $matches)) {
            $embaixador = \App\Models\User::query()
                ->where('referral_code', $matches[1])
                ->first();

            $link_afiliado = $embaixador->id;
        }

        $pass = \Illuminate\Support\Str::random(6);
        $user = \App\Models\User::create($data + [
            'password' => \Illuminate\Support\Facades\Hash::make($pass),
            'pass' => $pass,
            'referral_code' => strtoupper(\Illuminate\Support\Str::random(6)),
            'user_id' => $link_afiliado
        ]);
    }

    return new \Symfony\Component\HttpFoundation\JsonResponse([
        'message' => 'success',
        'email' => $user->email,
        'senha' => $user->pass,
        'link_dashboard' => config('app.url'),
        'link_afiliado' => "https://api.whatsapp.com/send?phone=5521991992766&text=Fazer%20meu%20cadastro%20({$user->referral_code})",
    ], 201);
});

Route::get('pesquisas', function () {
    $pesquisas = \App\Models\Pesquisa::query()
        ->where('is_active', 1)
        ->orderBy('order_column')
        ->get();

    if (!$pesquisas) {
        return new \Illuminate\Http\JsonResponse([
            'message' => 'error'
        ], 404);
    }

    $mensagem = "Digite o número para a pesquisa:\n\n";

    foreach ($pesquisas as $key => $pesquisa) {
        $mensagem .= $pesquisa->order_column . " - " . $pesquisa->title . "\n";
    }

    return new \Symfony\Component\HttpFoundation\JsonResponse([
        'pesquisas' => $mensagem
    ], 200);
});

Route::get('pesquisas/{id}/respostas', function ($id) {
    $pesquisa = \App\Models\Pesquisa::query()
        ->where('is_active', 1)
        ->where('order_column', $id)
        ->first();

    $respostas = \App\Models\Resposta::query()
        ->where('pesquisa_id', $pesquisa->id)
        ->orderBy('order_column')
        ->get();

    if (!$pesquisa || !$respostas) {
        return new \Illuminate\Http\JsonResponse([
            'message' => 'error'
        ], 404);
    }

    $mensagem = $pesquisa->title."\n\n";

    foreach ($respostas as $key => $resposta) {
        $mensagem .= $resposta->order_column . " - " . $resposta->title . "\n";
    }

    return new \Symfony\Component\HttpFoundation\JsonResponse([
        'respostas' => $mensagem
    ], 200);
});

Route::post('respostas', function (Request $request) {
    $pesquisa = \App\Models\Pesquisa::query()
        ->where('is_active', 1)
        ->where('order_column', $request->pesquisa_id)
        ->first();

    $resposta = \App\Models\Resposta::query()
        ->where('pesquisa_id', $pesquisa->id)
        ->where('order_column', $request->resposta_id)
        ->first();

    if (!$pesquisa || !$resposta) {
        return new \Illuminate\Http\JsonResponse([
            'message' => 'error'
        ], 406);
    }

    if (!$pesquisa->respostas()->where('whatsapp', $request->whatsapp)->exists()) {
        $pesquisa->respostas()->attach($resposta, ['whatsapp' => $request->whatsapp, 'created_at' => now(), 'updated_at' => now()]);
    }

    return new \Illuminate\Http\JsonResponse([
        'message' => 'success'
    ], 201);
});

Route::post('/nav', [APINav::class, 'nav']);
Route::post('/dashboard/stats-overview', [APIDashboard::class, 'statsOverview']);
Route::post('/dashboard/graphs', [APIGraphs::class, 'usersData']);
Route::post('/count-area', [APIBairro::class, 'countBairros']);
Route::post('/rede-total', [APIRede::class, 'redeData']);
Route::post('/rede-total-all', [APIRede::class, 'redeDataAll']);
Route::post('/rede-indicados', [APIRede::class, 'redeOne']);
Route::post('/users/export', [APIUser::class, 'exportInfo']);
