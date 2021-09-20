<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Images;
use App\Models\Property;
use App\Helper\fileUpload;


class indexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $data = Product::where('userId',$user->id)->get();
        return response()->json([
            "success" => true,
            "user" => $user,
            "data" => $data
        ]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = request()->user();
        $categories = Category::where('userId',$user->id)->get();
        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $all = $request->all();
        $file = (isset($all['file'])) ? $all['file'] : [];
        $properties = (isset($all['property'])) ? json_decode($all['property'],true) : [];
        unset($all['file']);
        unset($all['property']);
        $all['userId'] = $user->id;
        $create = Product::create($all);
        if($create){
            foreach($file as $item){
                $upload = fileUpload::newUpload($user->id,"products",$item,0);
                Images::create([
                    'objectId' => $create->id,
                    'image' => $upload
                ]);
            }

            foreach($properties as $property){
                Property::create([
                    'objectId' => $create->id,
                    'property' => $property['property'],
                    'value' => $property['value']
                ]);
            }
            return response()->json([
                'success' => true
            ]);
        }else {
            return response()->json([
                'success' => false
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = request()->user();
        $control = Product::where("userId",$user->id)->where("id",$id)->count();
        if($control == 0){
            return response()->json([
                "success" => false,
                "message" => "Belirtilen Ürün Bulunamadı"
            ]);
        }
        $product = Product::where("id",$id)->with('images')->with('property')->first();
        $categories = Category::where('userId',$user->id)->get();
        return response()->json([
            "success" => true,
            "message" => "Listeleme Başarılı",
            "product" => $product,
            "categories" => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = request()->user();
        $control = Product::where('id',$id)->where('userId',$user->id)->count();
        if($control == 0){ return response()->json(['success'=>false,'message'=>'Ürün size ait degil']);}

        $all = $request->all();
        $file = (isset($all['file'])) ? json_decode($all['file'],true) : [];
        $newFile = (isset($all['newFile'])) ? $all['newFile'] : [];
        $properties = (isset($all['property'])) ? json_decode($all['property'],true) : [];
        foreach($file as $item){
            if(isset($item['isRemove'])){
                
                $productImage = Images::where('id',$item['id'])->first();
                
                try {
                    unlink(public_path($productImage->image));
                }
                catch(\Exception $e){

                }
                Images::where('id',$item['id'])->delete();
            }
        }

        foreach($newFile as $item){
           
            $upload = fileUpload::newUpload($user->id,"products",$item,0);
            Images::create([
                'objectId'=>$id,
                'image'=>$upload
            ]);
        }

        Property::where('objectId',$id)->delete();
        foreach($properties as $property){
            Property::create([
                'objectId'=>$id,
                'property'=>$property['property'],
                'value'=>$property['value']
            ]);
        }
        
        
        unset($all['file']);
        unset($all['newFile']);
        unset($all['_method']);
        unset($all['property']);
        $create = Product::where('id',$id)->update($all);
        if($create){
            
            return response()->json([
                'success'=>true,
                'message'=>'Ürün Düzenleme Başarılı'
            ]);
        }
        else 
        {
            return response()->json([
                'success'=>false,
                'message'=>'Ürün Eklenemedi'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = request()->user();
        $control = Product::where("userId",$user->id)->where("id",$id)->count();
        if($control == 0){
            return response()->json([
                "success" => false,
                "message" => "Belirtilen Ürün Bulunamadı"
            ]);
        }
        foreach(Images::where("objectId",$id)->get() as $item){
            try{
                unlink(public_path($item->image));
            }catch(Exception $e){}
        }
        Images::where("objectId",$id)->delete();
        Property::where("objectId",$id)->delete();
        Product::where("id",$id)->delete();
        return response()->json([
            "success" => true,
            "message" => "Silme İşlemi Tamamlandı"
        ]);
    }
}
