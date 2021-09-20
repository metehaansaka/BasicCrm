import { inject, observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/front.layout';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../components/form/CustomInput';
import Select from 'react-select'
import ImageUploader from 'react-images-upload';
import CKEditor from 'ckeditor4-react';
import swal from 'sweetalert';

const Create = (props) => {
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [property, setProperty] = useState([]);
 
    useEffect(() => {
        axios.get('/api/product/create',{
            headers:{
                Authorization : "Bearer " + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setCategories(res.data.categories);
        }).catch(e => console.log(e))
    }, []);

    const handleSubmit = (values) => {
        const data = new FormData();

        images.forEach((image_file) => {
            data.append('file[]',image_file);
        });

        data.append('categoryId',values.categoryId);
        data.append('name',values.name);
        data.append('modelCode',values.modelCode);
        data.append('barcode',values.barcode);
        data.append('brand',values.brand);
        data.append('tax',values.tax);
        data.append('stock',values.stock);
        data.append('sellingPrice',values.sellingPrice);
        data.append('buyingPrice',values.buyingPrice);
        data.append('text',values.text);
        data.append('property',JSON.stringify(property));
        
        const config = {
            headers:{
                'Accept':'application/json',
                'content-type':'multipart/form-data',
                'Authorization':'Bearer '+ props.AuthStore.appState.user.access_token
            }
        };
        axios.post('/api/product',data,config)
        .then((res) => {
            console.log(res);
            if(res.data.success){
                swal("Ürün Eklendi");
                resetForm({});
                setImages([]);
                setProperty([]);
            }
            else 
            {
                swal(res.data.message);
            }
        })
        .catch(e => { console.log(e); });

    }
    
    const newProperty = () => {
        setProperty([...property,{property : "", value : ""}]);
    }

    const removeProperty = (index) => {
        const oldProperty = property;
        oldProperty.splice(index,1);
        setProperty([...oldProperty]);
    }

    const changeTextInput = (event, index) => {
        property[index][event.target.name] = event.target.value;
        setProperty([...property]);
    }

    return (
        <Layout>
            <div className="container mt-5">
                <Formik 
            initialValues={{
              categoryId:'',
              name:'',
              modelCode:'',
              barcode:'',
              brand:'',
              stock:0,
              tax:0,
              buyingPrice:'',
              sellingPrice:'',
              text:'',
            }}
            onSubmit={handleSubmit}
            validationSchema={
              Yup.object().shape({
               categoryId:Yup.number().required('Kategori Seçimi Zorunludur'),
               name:Yup.string().required('Ürün Adı Zorunludur'),
               modelCode:Yup.string().required('Ürün Model Kodu Zorunludur'),
               barcode:Yup.string().required('Ürün Barkodu Zorunludur'),
               brand:Yup.string().required('Ürün Markası Zorunludur'),
               buyingPrice:Yup.number().required('Ürün Alış Fiyatı Zorunludur'),
               sellingPrice:Yup.number().required('Ürün Satış Fiyatı Zorunludur'),
            
              })
            }
            >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                        errors,
                        isValid,
                        isSubmitting,
                        setFieldValue,
                        touched
                    })=>(
                  <div>   
                
                <div className="row">
                    <div className="col">
                        <Select 
                        onChange = {(e) => setFieldValue('categoryId',e.id)}
                        getOptionValue = {option => option.id}
                        getOptionLabel = {option => option.name}
                        placeholder = {"Ürün Kategorisi Seçiniz"}
                        options={categories} />
                    </div>
                </div>   
                
                <div className="row">
                    <div className="col">
                            <CustomInput 
                                type="text"
                                placeholder="Ürün Adı"
                                name="name"
                                value={values.name}
                                onChange={handleChange('name')}
                                />
                            {(errors.name && touched.name) && <p>{errors.name}</p>}
                    </div>
                    <div className="col">
                            <CustomInput 
                                type="text"
                                placeholder="Marka"
                                name="brand"
                                value={values.brand}
                                onChange={handleChange('brand')}
                                />
                            {(errors.brand && touched.brand) && <p>{errors.brand}</p>}
                       
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                            <CustomInput 
                                type="text"
                                placeholder="Barkod"
                                name="barcode"
                                value={values.barcode}
                                onChange={handleChange('barcode')}
                                />
                            {(errors.barcode && touched.barcode) && <p>{errors.barcode}</p>}
                    </div>
                    <div className="col">
                            <CustomInput 
                                type="text"
                                placeholder="Model Kodu"
                                name="modelCode"
                                value={values.modelCode}
                                onChange={handleChange('modelCode')}
                                />
                            {(errors.modelCode && touched.modelCode) && <p>{errors.modelCode}</p>}
                       
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                            <CustomInput 
                                type="number"
                                placeholder="Alış Fiyatı"
                                name="buyingPrice"
                                value={values.buyingPrice}
                                onChange={handleChange('buyingPrice')}
                                />
                            {(errors.buyingPrice && touched.buyingPrice) && <p>{errors.buyingPrice}</p>}
                    </div>
                    <div className="col">
                            <CustomInput 
                                type="number"
                                placeholder="Satış Fiyatı"
                                name="sellingPrice"
                                value={values.sellingPrice}
                                onChange={handleChange('sellingPrice')}
                                />
                            {(errors.sellingPrice && touched.sellingPrice) && <p>{errors.sellingPrice}</p>}
                       
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                            <CustomInput 
                                type="number"
                                placeholder="KDV Oranı"
                                name="tax"
                                value={values.tax}
                                onChange={handleChange('tax')}
                                />
                            {(errors.tax && touched.tax) && <p>{errors.tax}</p>}
                    </div>
                    <div className="col">
                            <CustomInput 
                                type="number"
                                placeholder="Stok"
                                name="stock"
                                value={values.stock}
                                onChange={handleChange('stock')}
                                />
                            {(errors.stock && touched.stock) && <p>{errors.stock}</p>}
                       
                    </div>
                </div>
                
                <div className="row mt-3">
                    <div className="col">
                    <CKEditor
                        data={values.text}
                        onChange={(event) => {
                            const data = event.editor.getData();
                            setFieldValue('text',data);
                        }}
                    />
                            {(errors.text && touched.text) && <p>{errors.text}</p>}
                    </div>
                </div>
                <div className="row">
                <div className="col">
                    <ImageUploader
                        withIcon={true}
                        buttonText='Resimleri Seçin'
                        onChange={(picturesFiles) => setImages(images.concat(picturesFiles))}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        withPreview = {true}
                    />
                    </div>
                </div>
                {
                    property.map((item,index) => (
                        <div className="row mt-2">
                            <div className="col-md-5">
                                <label>Özellik Adı</label>
                                <input type="text" className="form-control" name="property" onChange={(event) => changeTextInput(event,index)} value={item.property} />
                            </div>
                            <div className="col-md-5">
                                <label>Özellik Değeri</label>
                                <input type="text" className="form-control" name="value" onChange={(event) => changeTextInput(event,index)} value={item.value} />
                            </div>
                            <div className="col-md-1 d-flex justify-content-center align-items-end">
                                <button onClick={() => removeProperty(index)} className="btn btn-sm btn-danger">X</button>
                            </div>
                        </div>
                    ))
                }
                <button  style={{ marginBottom: "100px"}} onClick={newProperty} className="mt-2 btn btn-sm btn-primary">Yeni Özellik </button>
                <div className="row">
                <button
                onClick={handleSubmit}
                className="fixed-bottom mt-3  btn btn-sm btn-success" type="submit">Kaydet</button>
                </div>
                </div>
                )}
                </Formik>
            </div>
        </Layout>
    )
}

export default inject("AuthStore")(observer(Create));