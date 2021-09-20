<?php 
namespace App\Helper;
use Illuminate\Support\Facades\File;    
use Intervention\Image\Facades\Image;

class fileUpload
{
    static function newUpload($name,$directory,$file,$type = 0){
        $dir = 'files/'.$directory.'/'.$name;
        if(!empty($file)){
            if(!File::exists($dir)){
                File::makeDirectory($dir,0755,true);
            }
            $filename = rand(1,900000).".".$file->getClientOriginalExtension();
           
            if($type == 0){
                $path = public_path($dir."/".$filename);
                Image::make($file->getRealPath())->save($path);
            }
            else 
            {
                $path = public_path($dir."/");
                $file->move($path,$filename);
            }
            return $dir."/".$filename;
        }
        else 
        {
            return "";
        }
    }
}